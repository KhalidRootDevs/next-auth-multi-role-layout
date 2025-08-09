'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Define the field types
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'date'
  | 'switch'
  | 'custom';

// Define the validation types
export type ValidationRule = {
  required?: boolean | string;
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  validate?: Record<string, (value: any) => boolean | string>;
};

// Define the field configuration
export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  defaultValue?: any;
  options?: { label: string; value: string | number }[];
  validation?: ValidationRule;
  disabled?: boolean;
  className?: string;
  hidden?: boolean;
  render?: (field: any, fieldConfig: FieldConfig) => React.ReactNode;
  dependencies?: string[]; // Fields that this field depends on
  transform?: (value: any, formValues: any) => any; // Transform the value before submission
};

// Define the form configuration
export type FormConfig = {
  fields: FieldConfig[];
  onSubmit: (data: any) => Promise<void> | void;
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
  className?: string;
  defaultValues?: Record<string, any>;
};

// Helper function to build Zod schema from field configurations
const buildZodSchema = (fields: FieldConfig[]) => {
  const schemaMap: Record<string, any> = {};

  fields.forEach((field) => {
    if (field.hidden) return;

    let fieldSchema: any = z.any();

    // Set the base type
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'textarea':
        fieldSchema = z.string();
        if (field.type === 'email') {
          fieldSchema = fieldSchema.email('Please enter a valid email address');
        }
        break;
      case 'number':
        fieldSchema = z.coerce.number();
        break;
      case 'checkbox':
        fieldSchema = z.boolean();
        break;
      case 'date':
        fieldSchema = z.date();
        break;
      case 'select':
        fieldSchema = z.string();
        break;
      case 'switch':
        fieldSchema = z.boolean();
        break;
      default:
        fieldSchema = z.any();
    }

    // Apply validation rules
    if (field.validation) {
      const { required, min, max, minLength, maxLength, pattern, validate } =
        field.validation;

      if (required) {
        const message =
          typeof required === 'string'
            ? required
            : `${field.label} is required`;
        fieldSchema = fieldSchema.refine((val: any) => !!val, { message });
      } else {
        fieldSchema = fieldSchema.optional();
      }

      if (min && (field.type === 'number' || field.type === 'date')) {
        const value = typeof min === 'object' ? min.value : min;
        const message =
          typeof min === 'object'
            ? min.message
            : `${field.label} must be at least ${value}`;
        fieldSchema = fieldSchema.refine((val: any) => val >= value, {
          message
        });
      }

      if (max && (field.type === 'number' || field.type === 'date')) {
        const value = typeof max === 'object' ? max.value : max;
        const message =
          typeof max === 'object'
            ? max.message
            : `${field.label} must be at most ${value}`;
        fieldSchema = fieldSchema.refine((val: any) => val <= value, {
          message
        });
      }

      if (
        minLength &&
        (field.type === 'text' ||
          field.type === 'email' ||
          field.type === 'password' ||
          field.type === 'textarea')
      ) {
        const value =
          typeof minLength === 'object' ? minLength.value : minLength;
        const message =
          typeof minLength === 'object'
            ? minLength.message
            : `${field.label} must be at least ${value} characters`;
        fieldSchema = fieldSchema.refine(
          (val: string) => !val || val.length >= value,
          { message }
        );
      }

      if (
        maxLength &&
        (field.type === 'text' ||
          field.type === 'email' ||
          field.type === 'password' ||
          field.type === 'textarea')
      ) {
        const value =
          typeof maxLength === 'object' ? maxLength.value : maxLength;
        const message =
          typeof maxLength === 'object'
            ? maxLength.message
            : `${field.label} must be at most ${value} characters`;
        fieldSchema = fieldSchema.refine(
          (val: string) => !val || val.length <= value,
          { message }
        );
      }

      if (
        pattern &&
        (field.type === 'text' ||
          field.type === 'email' ||
          field.type === 'password')
      ) {
        const regex = 'value' in pattern ? pattern.value : pattern;
        const message =
          typeof pattern === 'object' && 'message' in pattern
            ? pattern.message
            : `${field.label} has an invalid format`;
        fieldSchema = fieldSchema.refine(
          (val: string) => !val || regex.test(val),
          { message }
        );
      }

      if (validate) {
        Object.entries(validate).forEach(([name, validator]) => {
          fieldSchema = fieldSchema.refine(
            (val: any) => {
              const result = validator(val);
              return typeof result === 'boolean' ? result : false;
            },
            (val: any) => {
              const result = validator(val);
              return {
                message:
                  typeof result === 'string'
                    ? result
                    : `${field.label} is invalid`
              };
            }
          );
        });
      }
    } else if (field.type !== 'custom') {
      // If no validation is provided, make the field optional
      fieldSchema = fieldSchema.optional();
    }

    schemaMap[field.name] = fieldSchema;
  });

  return z.object(schemaMap);
};

export function DynamicForm({
  fields,
  onSubmit,
  submitButtonText = 'Submit',
  cancelButtonText = 'Cancel',
  onCancel,
  className,
  defaultValues
}: FormConfig) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSchema, setFormSchema] = useState<z.ZodType<any>>(
    buildZodSchema(fields)
  );

  // Build the form schema
  useEffect(() => {
    setFormSchema(buildZodSchema(fields));
  }, [fields]);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {}
  });

  // Watch form values for dependencies
  const formValues = form.watch();

  // Handle form submission
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Transform values if needed
      const transformedData = { ...data };
      fields.forEach((field) => {
        if (field.transform && data[field.name] !== undefined) {
          transformedData[field.name] = field.transform(data[field.name], data);
        }
      });

      await onSubmit(transformedData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the appropriate field component based on the field type
  const renderField = (field: FieldConfig) => {
    // Skip hidden fields
    if (field.hidden) return null;

    // Check if the field has dependencies and should be conditionally rendered
    if (field.dependencies && field.dependencies.length > 0) {
      const shouldRender = field.dependencies.every((dep) => {
        const dependencyField = fields.find((f) => f.name === dep);
        if (!dependencyField) return true;

        const dependencyValue = formValues[dep];
        if (
          dependencyField.type === 'checkbox' ||
          dependencyField.type === 'switch'
        ) {
          return !!dependencyValue;
        }
        return dependencyValue !== undefined && dependencyValue !== '';
      });

      if (!shouldRender) return null;
    }

    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name}
        render={({ field: formField }) => (
          <FormItem className={field.className}>
            <FormLabel>{field.label}</FormLabel>
            <FormControl>
              {field.render
                ? field.render(formField, field)
                : renderFieldByType(field, formField)}
            </FormControl>
            {field.description && (
              <FormDescription>{field.description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  // Render the field based on its type
  const renderFieldByType = (fieldConfig: FieldConfig, field: any) => {
    switch (fieldConfig.type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <Input
            type={fieldConfig.type}
            placeholder={fieldConfig.placeholder}
            {...field}
            disabled={fieldConfig.disabled}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            placeholder={fieldConfig.placeholder}
            {...field}
            onChange={(e) => field.onChange(e.target.valueAsNumber)}
            disabled={fieldConfig.disabled}
          />
        );
      case 'textarea':
        return (
          <Textarea
            placeholder={fieldConfig.placeholder}
            {...field}
            disabled={fieldConfig.disabled}
          />
        );
      case 'select':
        return (
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={fieldConfig.disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder={fieldConfig.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {fieldConfig.options?.map((option) => (
                <SelectItem
                  key={option.value.toString()}
                  value={option.value.toString()}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={fieldConfig.disabled}
            />
            <span className="text-sm text-muted-foreground">
              {fieldConfig.placeholder}
            </span>
          </div>
        );
      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !field.value && 'text-muted-foreground'
                )}
                disabled={fieldConfig.disabled}
              >
                {field.value ? (
                  format(field.value, 'PPP')
                ) : (
                  <span>{fieldConfig.placeholder || 'Pick a date'}</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      case 'switch':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={fieldConfig.disabled}
            />
            <span className="text-sm text-muted-foreground">
              {fieldConfig.placeholder}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn('space-y-6', className)}
      >
        <div className="space-y-4">{fields.map(renderField)}</div>
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {cancelButtonText}
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
