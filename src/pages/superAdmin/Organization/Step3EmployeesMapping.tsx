import React, { useState, useRef } from 'react';
import { Edit, Trash2, Plus, Upload, Download, AlertCircle } from 'lucide-react';

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  boss: string;
}

interface Department {
  id: string;
  name: string;
  code: string;
}

interface Step3EmployeesMappingProps {
  employees: Employee[];
  departments: Department[];
  onUpdate: (employees: Employee[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step3EmployeesMapping: React.FC<Step3EmployeesMappingProps> = ({
  employees,
  departments,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    designation: '',
    department: '',
    boss: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddEmployee = () => {
    if (!formData.employeeId || !formData.name || !formData.email) return;

    const newEmployee: Employee = {
      id: Date.now().toString(),
      ...formData,
    };

    const updatedEmployees = [...employees, newEmployee];
    onUpdate(updatedEmployees);
    resetForm();
  };

  const handleEditEmployee = (id: string) => {
    const employee = employees.find(e => e.id === id);
    if (employee) {
      setFormData({
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        designation: employee.designation,
        department: employee.department,
        boss: employee.boss,
      });
      setEditingId(id);
    }
  };

  const handleUpdateEmployee = () => {
    if (!formData.employeeId || !formData.name || !formData.email || !editingId) return;

    const updatedEmployees = employees.map(emp =>
      emp.id === editingId ? { ...emp, ...formData } : emp
    );

    onUpdate(updatedEmployees);
    resetForm();
  };

  const handleDeleteEmployee = (id: string) => {
    const updatedEmployees = employees.filter(emp => emp.id !== id);
    onUpdate(updatedEmployees);
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      name: '',
      email: '',
      designation: '',
      department: '',
      boss: '',
    });
    setEditingId(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simulate file processing and validation
    const errors = [
      'Row 3: Invalid email format',
      'Row 5: Duplicate Employee ID',
      'Row 8: Missing required field: Name',
    ];
    
    setUploadErrors(errors);
    
    // In a real implementation, you would parse the CSV/Excel file here
    // and add valid employees to the list
  };

  const downloadTemplate = () => {
    // In a real implementation, this would download an actual CSV template
    const csvContent = 'Employee ID,Name,Email,Designation,Department,Boss\nEMP001,John Doe,john@example.com,Software Engineer,Engineering,Jane Smith';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getAvailableBosses = () => {
    return employees.filter(emp => emp.id !== editingId);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Employee Setup</h2>
      
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setShowBulkUpload(false)}
            className={`px-4 py-2 rounded-md ${!showBulkUpload ? 'bg-stages-self-reflection text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Manual Entry
          </button>
          <button
            onClick={() => setShowBulkUpload(true)}
            className={`px-4 py-2 rounded-md ${showBulkUpload ? 'bg-stages-self-reflection text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Bulk Upload
          </button>
        </div>

        {showBulkUpload ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drag & Drop Excel/CSV here or</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Browse
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <Download className="w-4 h-4" />
              Download Employee Data Template
            </button>

            {uploadErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800 mb-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">{uploadErrors.length} rows failed</span>
                </div>
                <ul className="text-red-700 text-sm space-y-1">
                  {uploadErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
                <button className="text-red-800 hover:text-red-900 font-medium text-sm mt-2">
                  Download error log
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID
              </label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stages-self-reflection"
                placeholder="e.g., EMP001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stages-self-reflection"
                placeholder="e.g., John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stages-self-reflection"
                placeholder="e.g., john.doe@chaturvima.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stages-self-reflection"
                placeholder="e.g., Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stages-self-reflection"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Boss
              </label>
              <select
                value={formData.boss}
                onChange={(e) => handleInputChange('boss', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stages-self-reflection"
              >
                <option value="">Select Boss</option>
                {getAvailableBosses().map((emp) => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {!showBulkUpload && (
          <div className="mb-6">
            {editingId ? (
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateEmployee}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-teal text-white rounded-md hover:bg-stages-steady-state"
                >
                  Update Employee
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddEmployee}
                className="flex items-center gap-2 px-4 py-2 bg-stages-self-reflection text-white rounded-md hover:bg-stages-self-reflection-dark"
              >
                <Plus className="w-4 h-4" />
                Add Employee
              </button>
            )}
          </div>
        )}
      </div>

      {employees.length > 0 && (
        <div className="mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Boss</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">{employee.employeeId}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{employee.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{employee.email}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{employee.department}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{employee.boss || '-'}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditEmployee(employee.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-stages-self-reflection text-white rounded-md hover:bg-stages-self-reflection-dark"
        >
          Next: Review & Save
        </button>
      </div>
    </div>
  );
};

export default Step3EmployeesMapping;
