import React, { useState } from 'react';
import { proxy, useSnapshot } from 'valtio';
import { PlusCircle, MinusCircle, Trash2, Settings, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const fieldTypes = defaultFieldTypes.map(type => ({
    ...type,
    label: snap.customLabels[type.value] || type.label
  }));

  const fieldType = fieldTypes.find(t => t.value === newFieldType);
  const elementLabel = fieldType ? fieldType.label : 'Unknown';

const addField = () => {
  const fieldType = fieldTypes.find(t => t.value === newFieldType);
  const elementLabel = fieldType ? fieldType.label : 'Unknown';
  formState.fields.push({
    id: Date.now(),
    type: newFieldType,
    label: `New ${elementLabel} field`, // Fixed: Use elementLabel instead of fieldType
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

  const renderPreview = (field: any) => {
    switch (field.type) {
      case 'text':
      case 'number':
      case 'email':
      case 'password':
      case 'tel':
      case 'url':
      case 'date':
      case 'time':
      case 'datetime-local':
      case 'month':
      case 'week':
      case 'color':
      case 'file':
        return <Input type={field.type} placeholder={field.label} />;
      case 'textarea':
        return <Textarea placeholder={field.label} />;
      case 'select':
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={field.label} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<React.AwaitedReactNode> | null | undefined, index: React.Key | null | undefined) => (
                <SelectItem key={index} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'radio':
        return (
          <RadioGroup>
            {field.options.map((option: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<React.AwaitedReactNode> | null | undefined, index: React.Key | null | undefined) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`radio-${field.id}-${index}`} />
                <Label htmlFor={`radio-${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'checkbox':
        return (
          <div>
            {field.options.map((option: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined, index: React.Key | null | undefined) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox id={`checkbox-${field.id}-${index}`} />
                <Label htmlFor={`checkbox-${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );
      case 'switch':
        return <Switch />;
      case 'range':
        return <Input type="range" min={field.min} max={field.max} step={field.step} />;
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

  const FullFormPreview = () => (
    <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{snap.title}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          {snap.fields.map((field: { id: React.Key | null | undefined; label: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={`preview-${field.id}`}>{field.label}</Label>
              {renderPreview(field)}
            </div>
          ))}
          <Button type="button">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          <Input
            value={snap.title}
            onChange={(e) => formState.title = e.target.value}
            className="text-2xl font-bold"
          />
        </h1>
        <Button onClick={() => setIsPreviewModalOpen(true)}>
          <Eye className="h-4 w-4 mr-2" />
          Preview Form
        </Button>
      </div>
      
      {snap.fields.map((field: { id: React.Key | null | undefined; label: string | number | readonly string[] | undefined; type: string | undefined; required: string | boolean | undefined; }) => (
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
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeField(field.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            {renderPreview(field)}

            <div className="mt-2 flex items-center space-x-2">
              <Checkbox
                id={`required-${field.id}`}
                checked={field.required}
                onCheckedChange={(checked) => updateField(field.id, { required: checked })}
              />
              <Label htmlFor={`required-${field.id}`}>Required</Label>
            </div>

            <div className="mt-4 p-4 border rounded">
              <h4 className="font-semibold mb-2">Preview:</h4>
              {renderPreview(field)}
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="mt-4 flex items-center space-x-2">
        <Select value={newFieldType} onValueChange={setNewFieldType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select field type" />
          </SelectTrigger>
          <SelectContent>
            {fieldTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
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
      
      <FullFormPreview />
    </div>
  );
};

export default FormEditor;