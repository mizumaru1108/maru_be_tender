import { FormSingleProps } from '../../FormGenerator';
export const TRACKS = ['Mosques Department', 'Facilitated Scholarship Track', 'Initiatives Track'];

export const NewMessageFormFields = [
  {
    type: 'select',
    name: 'trackType',
    label: 'new_message_modal.form.label.track_type',
    md: 12,
    placeholder: 'new_message_modal.form.label.track_type',
    children: (
      <>
        {TRACKS.map((item, index) => (
          <option key={index} value={item} style={{ backgroundColor: '#fff' }}>
            {item}
          </option>
        ))}
      </>
    ),
  },
] as Array<FormSingleProps>;
