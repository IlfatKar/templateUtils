import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export enum IFieldType {
  Text = 'text',
  Image = 'file',
  Select = 'select',
  Date = 'date',
}

interface IField {
  title: string;
  typeTitle: string;
  type: IFieldType;
  default: any;
  test?: (val: any) => boolean;
  selectValues?: { id: number; title: string }[];
  matchMsg?: string;
  required?: boolean;
  onError?: () => void;
}

interface IFormProps {
  id: number;
  title: string;
  fields: IField[];
  onSubmit: (form: object) => void;
}

export default function Form({ id, fields, title, onSubmit }: IFormProps) {
  const [form, setForm] = useState<object>({});
  const [errs, setErrs] = useState<boolean[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const a: object = { id };
    fields.forEach((field) => {
      a[field.typeTitle] = field.default;
    });
    setForm(a);
  }, [fields]);

  return (
    <div className="AddClient">
      <h2>{title}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const arr = [...errs];
          fields.forEach((field, i) => {
            if (field.test && !field.test(form[field.typeTitle])) {
              arr[i] = true;
            }
          });
          setErrs(arr);
          !arr.find((item) => item === true) && onSubmit(form);
        }}
        className="form"
      >
        {fields.map((field, i) => (
          <label style={{ display: 'flex' }} key={field.title}>
            <span>{field.title}</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {field.type !== IFieldType.Select && (
                <input
                  style={{
                    width: '100%',
                    border: errs[i] ? '2px solid red' : 'none',
                  }}
                  placeholder={field.title}
                  required={!!field.required}
                  type={field.type}
                  value={form[field.typeTitle]}
                  onChange={(e) => {
                    const arr = [...errs];
                    arr[i] = false;
                    setErrs(arr);
                    setForm((prev) => ({
                      ...prev,
                      [field.typeTitle]: e.target.value,
                    }));
                  }}
                />
              )}
              {field.type === IFieldType.Select && (
                <select
                  style={{
                    width: '100%',
                    border: errs[i] ? '2px solid red' : 'none',
                  }}
                  required={!!field.required}
                  value={form[field.typeTitle]}
                  onChange={(e) => {
                    const arr = [...errs];
                    arr[i] = false;
                    setErrs(arr);
                    setForm((prev) => ({
                      ...prev,
                      [field.typeTitle]: e.target.value,
                    }));
                  }}
                >
                  {field.selectValues?.map((item) => (
                    <option value={item.id}>{item.title}</option>
                  ))}
                </select>
              )}
              {errs[i] && (
                <small style={{ textAlign: 'center' }}>
                  {field.matchMsg || 'Ошибка'}
                </small>
              )}
            </div>
          </label>
        ))}
        <button type="submit">Отправить</button>
        <button
          onClick={() => {
            navigate(-1);
          }}
        >
          Назад
        </button>
      </form>
    </div>
  );
}
