import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Edit, ChevronDown, ChevronRight } from 'lucide-react';

interface OrganizationInfo {
  name: string;
  type: string;
  size: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
}

interface Department {
  id: string;
  name: string;
  code: string;
}

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  boss: string;
}

interface Step4ReviewSaveProps {
  organizationInfo: OrganizationInfo;
  departments: Department[];
  employees: Employee[];
  onBack: () => void;
  onSave: () => void;
}

const Step4ReviewSave: React.FC<Step4ReviewSaveProps> = ({
  organizationInfo,
  departments,
  employees,
  onBack,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'departments' | 'employees' | 'hierarchy'>('departments');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const validateData = () => {
    const errors: string[] = [];
    
    // Validate organization info
    if (!organizationInfo.name) errors.push('Organization name is required');
    if (!organizationInfo.email) errors.push('Organization email is required');
    
    // Validate departments
    if (departments.length === 0) errors.push('At least one department is required');
    
    // Validate employees
    const employeeIds = new Set();
    const duplicateIds: string[] = [];
    
    employees.forEach(emp => {
      if (!emp.employeeId || !emp.name || !emp.email) {
        errors.push(`Employee ${emp.name || 'Unknown'} has missing required fields`);
      }
      
      if (employeeIds.has(emp.employeeId)) {
        duplicateIds.push(emp.employeeId);
      } else {
        employeeIds.add(emp.employeeId);
      }
    });
    
    if (duplicateIds.length > 0) {
      errors.push(`Duplicate Employee IDs: ${duplicateIds.join(', ')}`);
    }
    
    return errors;
  };

  const validationErrors = validateData();
  const isValid = validationErrors.length === 0;

  const getEmployeesByDepartment = () => {
    return departments.map(dept => ({
      ...dept,
      employees: employees.filter(emp => emp.department === dept.name)
    }));
  };

  interface HierarchyNode {
    employee: Employee | undefined;
    reports: HierarchyNode[];
  }

  const buildHierarchy = (): Record<string, HierarchyNode> => {
    const hierarchy: Record<string, HierarchyNode> = {};
    const employeeMap = new Map(employees.map(emp => [emp.name, emp]));
    
    employees.forEach(emp => {
      if (!emp.boss || emp.boss === '') {
        // Top-level employee (no boss)
        if (!hierarchy[emp.name]) {
          hierarchy[emp.name] = { employee: emp, reports: [] };
        }
      } else {
        // Employee has a boss
        if (!hierarchy[emp.boss]) {
          const bossEmployee = employeeMap.get(emp.boss);
          hierarchy[emp.boss] = { employee: bossEmployee, reports: [] };
        }
        hierarchy[emp.boss].reports.push({ employee: emp, reports: [] });
      }
    });
    
    return hierarchy;
  };

  const toggleNode = (nodeName: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeName)) {
      newExpanded.delete(nodeName);
    } else {
      newExpanded.add(nodeName);
    }
    setExpandedNodes(newExpanded);
  };

  const renderHierarchyNode = (node: HierarchyNode, level = 0) => {
    const hasReports = node.reports && node.reports.length > 0;
    const isExpanded = expandedNodes.has(node.employee?.name || '');
    
    return (
      <div key={node.employee?.name || Math.random()} className={`ml-${level * 4}`}>
        <div className="flex items-center py-2 px-3 hover:bg-gray-50 rounded">
          {hasReports && (
            <button
              onClick={() => toggleNode(node.employee?.name || '')}
              className="mr-2 text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
          {!hasReports && <div className="w-6 mr-2" />}
          <div className="flex-1">
            <div className="font-medium text-gray-900">{node.employee?.name}</div>
            <div className="text-sm text-gray-500">{node.employee?.designation} • {node.employee?.department}</div>
          </div>
          <div className="text-sm text-gray-500">
            {hasReports ? `${node.reports.length} direct report${node.reports.length !== 1 ? 's' : ''}` : ''}
          </div>
        </div>
        {hasReports && isExpanded && (
          <div className="ml-4 border-l-2 border-gray-200">
            {node.reports.map((report: HierarchyNode) => renderHierarchyNode(report, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Review & Save</h2>
      
      {/* Validation Status */}
      <div className={`mb-6 p-4 rounded-lg border ${isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center gap-2">
          {isValid ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">All data is complete and valid</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">Please fix the following issues:</span>
            </>
          )}
        </div>
        {!isValid && (
          <ul className="mt-2 text-red-700 text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('departments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'departments'
                ? 'border-stages-self-reflection text-stages-self-reflection'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Departments
          </button>
          <button
            onClick={() => setActiveTab('employees')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'employees'
                ? 'border-stages-self-reflection text-stages-self-reflection'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Employees
          </button>
          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'hierarchy'
                ? 'border-stages-self-reflection text-stages-self-reflection'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Boss Mapping
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {activeTab === 'departments' && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dept Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dept Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"># Employees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {getEmployeesByDepartment().map((dept) => (
                  <tr key={dept.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{dept.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{dept.code || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{dept.employees.length}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Designation</th>
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
                    <td className="px-4 py-4 text-sm text-gray-500">{employee.designation}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{employee.department}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{employee.boss || '-'}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'hierarchy' && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Organization Hierarchy</h3>
            <div className="space-y-2">
              {Object.values(buildHierarchy()).map((node: HierarchyNode) => renderHierarchyNode(node))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Back to Edit
        </button>
        <button
          onClick={onSave}
          disabled={!isValid}
          className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 ${
            isValid
              ? 'bg-stages-self-reflection text-white hover:bg-stages-self-reflection-dark focus:ring-stages-self-reflection'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Confirm & Save
        </button>
      </div>
    </div>
  );
};

export default Step4ReviewSave;
