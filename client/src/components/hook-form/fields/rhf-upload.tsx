import { ReactNode } from 'react';
import { DropzoneOptions } from 'react-dropzone';
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { SxProps, Theme } from '@mui/material/styles';
import FormHelperText from '@mui/material/FormHelperText';
//
import { UploadAvatar } from '@/components/upload';

// ----------------------------------------------------------------------

interface RHFUploadAvatarProps extends Omit<DropzoneOptions, 'multiple'> {
  name: string;
  helperText?: ReactNode;
  sx?: SxProps<Theme>;
}

export function RHFUploadAvatar({ name, helperText, ...other }: RHFUploadAvatarProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <UploadAvatar
            error={!!error}
            file={field.value}
            helperText={helperText}
            {...other}
          />

          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}