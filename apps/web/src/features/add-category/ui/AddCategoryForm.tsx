import type { TransactionType } from '@finance-tracker/shared';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCreateCategoryMutation } from '../../../entities/category';
import { pushToast } from '../../../shared/lib';
import { CATEGORY_COLORS, CATEGORY_ICON_KEYS, CategoryIcon } from '../../../shared/ui';

export function AddCategoryForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateCategoryMutation();

  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [icon, setIcon] = useState(CATEGORY_ICON_KEYS[0] ?? 'package');
  const [color, setColor] = useState(CATEGORY_COLORS[0] ?? '#95a5a6');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;

    mutate(
      { name: name.trim(), type, icon, color },
      {
        onSuccess: () => {
          pushToast('success', t('addCategory.added'));
          navigate(-1);
        },
        onError: () => {
          pushToast('error', t('addCategory.addFailed'));
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        {t('addCategory.name')}
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </label>
      <label>
        {t('addCategory.type')}
        <select value={type} onChange={(event) => setType(event.target.value as TransactionType)}>
          <option value="expense">{t('addCategory.expense')}</option>
          <option value="income">{t('addCategory.income')}</option>
        </select>
      </label>
      <div className="field-group">
        <span>{t('addCategory.icon')}</span>
        <div className="category-grid">
          {CATEGORY_ICON_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className={key === icon ? 'icon-swatch selected' : 'icon-swatch'}
              style={{ backgroundColor: color }}
              onClick={() => setIcon(key)}
            >
              <CategoryIcon name={key} />
            </button>
          ))}
        </div>
      </div>
      <div className="field-group">
        <span>{t('addCategory.color')}</span>
        <div className="color-grid">
          {CATEGORY_COLORS.map((swatch) => (
            <button
              key={swatch}
              type="button"
              className={swatch === color ? 'color-swatch selected' : 'color-swatch'}
              style={{ backgroundColor: swatch }}
              onClick={() => setColor(swatch)}
              aria-label={swatch}
            />
          ))}
        </div>
      </div>
      <button type="submit" disabled={isPending}>
        {isPending ? t('addCategory.adding') : t('addCategory.add')}
      </button>
    </form>
  );
}
