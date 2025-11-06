import { useState } from 'react';
import StepIndicator from './StepIndicator';
import Step1OrganizationInfo from './Step1OrganizationInfo';
import Step2Departments from './Step2Departments';
import Step3EmployeesMapping from './Step3EmployeesMapping';
import Step4ReviewSave from './Step4ReviewSave';

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

const OrganizationSetup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [organizationInfo, setOrganizationInfo] = useState<OrganizationInfo>({
    name: '',
    type: '',
    size: '',
    industry: '',
    website: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    country: '',
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const steps = [
    'Organisation Info',
    'Departments',
    'Employees & Boss Mapping',
    'Review & Save'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    // Handle final save logic here
    console.log('Saving organization setup:', {
      organizationInfo,
      departments,
      employees,
    });
    // You can add API calls or navigation logic here
    alert('Organization setup saved successfully!');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step1OrganizationInfo
            data={organizationInfo}
            onUpdate={setOrganizationInfo}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <Step2Departments
            departments={departments}
            onUpdate={setDepartments}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <Step3EmployeesMapping
            employees={employees}
            departments={departments}
            onUpdate={setEmployees}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Step4ReviewSave
            organizationInfo={organizationInfo}
            departments={departments}
            employees={employees}
            onBack={handleBack}
            onSave={handleSave}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Organisation Setup</h1>
          <p className="text-gray-600">Set up your organization structure, departments, and employee hierarchy</p>
        </div>
        
        <StepIndicator currentStep={currentStep} steps={steps} />
        
        <div className="mt-8">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};

export default OrganizationSetup;