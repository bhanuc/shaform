"use client"
import FormDisplay from "@/components/form/FormDisplay";

const MyApp = () => {
  const formConfig = {
    title: 'My Form',
    fields: [
      { id: 'name', type: 'text', label: 'Name', required: true },
      { id: 'email', type: 'email', label: 'Email', required: true },
      { id: 'age', type: 'number', label: 'Age' },
      // ... other fields
    ]
  };

  const handleSubmit = (formData: any) => {
    console.log('Form submitted with data:', formData);
    // Handle form submission, e.g., send data to a server
  };

  return <FormDisplay formConfig={formConfig} onSubmit={handleSubmit} />;
};

export default MyApp;