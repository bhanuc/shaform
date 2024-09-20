import React, { useState } from 'react';
import { proxy, useSnapshot } from 'valtio';
import { PlusCircle, MinusCircle, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckedState } from '@radix-ui/react-checkbox';

// Valtio state
const formState: any = proxy({
  title: 'Untitled Form',
  fields: [],
  customLabels: {}
});

const defaultFieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'password', label: 'Password' },
  { value: 'tel', label: 'Telephone' },
  { value: 'url', label: 'URL' },
  { value: 'date', label: 'Date' },
  { value: 'time', label: 'Time' },
  { value: 'datetime-local', label: 'Date and Time' },
  { value: 'month', label: 'Month' },
  { value: 'week', label: 'Week' },
  { value: 'color', label: 'Color' },
  { value: 'range', label: 'Range' },
  { value: 'file', label: 'File Upload' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'select', label: 'Select' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Checkboxes' },
  { value: 'switch', label: 'Switch' },
];

const FormEditor = () => {
  const snap = useSnapshot(formState);
  const [newFieldType, setNewFieldType] = useState('text');
  const [isLabelDialogOpen, setIsLabelDialogOpen] = useState(false);

  const fieldTypes = defaultFieldTypes.map(type => ({
    ...type,
    label: snap.customLabels[type.value] || type.label
  }));

  const fieldType = fieldTypes.find(t => t.value === newFieldType);
  const elementLabel = fieldType ? fieldType.label : 'Unknown';

  const addField = () => {
    formState.fields.push({
      id: Date.now(),
      type: newFieldType,
      label: fieldType,
      options: ['select', 'radio', 'checkbox'].includes(newFieldType) ? ['Option 1'] : undefined,
      min: newFieldType === 'range' ? 0 : undefined,
      max: newFieldType === 'range' ? 100 : undefined,
      step: newFieldType === 'range' ? 1 : undefined,
      required: false,
    });
  };

  const updateField = (id: any, updates: { min?: number; max?: number; step?: number; label?: string; type?: string; required?: CheckedState; }) => {
    const fieldIndex = formState.fields.findIndex((field: { id: any; }) => field.id === id);
    if (fieldIndex !== -1) {
      formState.fields[fieldIndex] = { ...formState.fields[fieldIndex], ...updates };
    }
  };

  const removeField = (id: any) => {
    formState.fields = formState.fields.filter((field: { id: any; }) => field.id !== id);
  };

  const addOption = (fieldId: any) => {
    const field = formState.fields.find((f: { id: any; }) => f.id === fieldId);
    if (field && ['select', 'radio', 'checkbox'].includes(field.type)) {
      field.options.push(`Option ${field.options.length + 1}`);
    }
  };

  const updateOption = (fieldId: any, optionIndex: string | number, value: string) => {
    const field = formState.fields.find((f: { id: any; }) => f.id === fieldId);
    if (field && ['select', 'radio', 'checkbox'].includes(field.type)) {
      field.options[optionIndex] = value;
    }
  };

  const removeOption = (fieldId: any, optionIndex: any) => {
    const field = formState.fields.find((f: { id: any; }) => f.id === fieldId);
    if (field && ['select', 'radio', 'checkbox'].includes(field.type)) {
      field.options.splice(optionIndex, 1);
    }
  };

  const renderFieldOptions = (field: { type: any; min: string | number | readonly string[] | undefined; id: any; max: string | number | readonly string[] | undefined; step: string | number | readonly string[] | undefined; options: any[]; }) => {
    switch (field.type) {
      case 'range':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <label>Min:</label>
              <Input
                type="number"
                value={field.min}
                onChange={(e) => updateField(field.id, { min: Number(e.target.value) })}
                className="w-20"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label>Max:</label>
              <Input
                type="number"
                value={field.max}
                onChange={(e) => updateField(field.id, { max: Number(e.target.value) })}
                className="w-20"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label>Step:</label>
              <Input
                type="number"
                value={field.step}
                onChange={(e) => updateField(field.id, { step: Number(e.target.value) })}
                className="w-20"
              />
            </div>
          </div>
        );
      case 'select':
      case 'radio':
      case 'checkbox':
        return (
          <div className="mt-2">
            <h4 className="font-semibold mb-2">Options:</h4>
            {field.options.map((option: string | number | readonly string[] | undefined, index: string| number ) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(field.id, index, e.target.value)}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeOption(field.id, index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={() => addOption(field.id)}>
              Add Option
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const CustomLabelDialog = () => (
    <Dialog open={isLabelDialogOpen} onOpenChange={setIsLabelDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Customize Labels
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customize Field Type Labels</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {defaultFieldTypes.map((type) => (
            <div key={type.value} className="grid grid-cols-4 items-center gap-4">
              <label htmlFor={type.value} className="text-right">
                {type.label}:
              </label>
              <Input
                id={type.value}
                value={snap.customLabels[type.value] || type.label}
                onChange={(e) => formState.customLabels[type.value] = e.target.value}
                className="col-span-3"
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        <Input
          value={snap.title}
          onChange={(e) => formState.title = e.target.value}
          className="text-2xl font-bold"
        />
      </h1>
      
      {snap.fields.map((field: any) => (
        <Card key={field.id} className="mb-4">
          <CardHeader>
            <CardTitle>
              <Input
                value={field.label}
                onChange={(e) => updateField(field.id, { label: e.target.value })}
                className="font-bold"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-2">
              <Select
                value={field.type}
                onValueChange={(value) => updateField(field.id, { type: value })}
              >
                {fieldTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeField(field.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            {renderFieldOptions(field)}

            <div className="mt-2 flex items-center space-x-2">
              <Checkbox
                id={`required-${field.id}`}
                checked={field.required}
                onCheckedChange={(checked) => updateField(field.id, { required: checked })}
              />
              <label htmlFor={`required-${field.id}`}>Required</label>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="mt-4 flex items-center space-x-2">
        <Select
          value={newFieldType}
          onValueChange={setNewFieldType}
        >
          {fieldTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </Select>
        <Button onClick={addField}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Field
        </Button>
        <Button onClick={() => formState.fields.pop()} disabled={snap.fields.length === 0}>
          <MinusCircle className="h-4 w-4 mr-2" />
          Remove Last Field
        </Button>
        <CustomLabelDialog />
      </div>
    </div>
  );
};

export default FormEditor;