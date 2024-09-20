import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

const FormDisplay = ({ formConfig, onSubmit }: any) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    // Initialize form data based on the form configuration
    const initialData: any = {};
    formConfig.fields.forEach((field: { type: string; id: string | number; }) => {
      if (field.type === 'checkbox') {
        initialData[field.id] = [];
      } else if (field.type === 'switch') {
        initialData[field.id] = false;
      } else {
        initialData[field.id] = '';
      }
    });
    setFormData(initialData);
  }, [formConfig]);

  const handleInputChange = (fieldId: any, value: string | boolean | FileList | null) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [fieldId]: value
    }));
  };

  const handleCheckboxChange = (fieldId: string | number, value: any, checked: string | boolean) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [fieldId]: checked
        ? [...(prevData[fieldId] || []), value]
        : (prevData[fieldId] || []).filter((item: any) => item !== value)
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field: any) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'tel':
      case 'url':
      case 'number':
      case 'date':
      case 'time':
      case 'datetime-local':
      case 'month':
      case 'week':
      case 'color':
        return (
          <Input
            type={field.type}
            id={field.id}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
          />
        );
      case 'textarea':
        return (
          <Textarea
            id={field.id}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
          />
        );
      case 'select':
        return (
          <Select
            value={formData[field.id] || ''}
            onValueChange={(value) => handleInputChange(field.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option: any, index: React.Key | null | undefined) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'radio':
        return (
          <RadioGroup
            value={formData[field.id] || ''}
            onValueChange={(value) => handleInputChange(field.id, value)}
          >
            {field.options.map((option: any, index: any) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'checkbox':
        return field.options.map((option: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined, index: React.Key | null | undefined) => (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox
              id={`${field.id}-${index}`}
              checked={(formData[field.id] || []).includes(option)}
              onCheckedChange={(checked) => handleCheckboxChange(field.id, option, checked)}
            />
            <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
          </div>
        ));
      case 'switch':
        return (
          <Switch
            id={field.id}
            checked={formData[field.id] || false}
            onCheckedChange={(checked) => handleInputChange(field.id, checked)}
          />
        );
      case 'range':
        return (
          <Input
            type="range"
            id={field.id}
            min={field.min}
            max={field.max}
            step={field.step}
            value={formData[field.id] || field.min}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );
      case 'file':
        return (
          <Input
            type="file"
            id={field.id}
            onChange={(e) => handleInputChange(field.id, e.target.files)}
            required={field.required}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">{formConfig.title}</h2>
      {formConfig.fields.map((field: { id:any; label: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id}>{field.label}</Label>
          {renderField(field)}
        </div>
      ))}
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default FormDisplay;