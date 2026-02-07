import { ErrorCode, FileRejection, Accept } from "react-dropzone";
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// i18n
import { useTranslation } from 'react-i18next';
// utils
import { fData } from '@/utils/format-number';
//
import { fileData } from '../file-thumbnail';

// ----------------------------------------------------------------------

function convertToMB(size: number) {
  return size / (1024 * 1024);
}

// ----------------------------------------------------------------------

interface RejectionFilesProps {
  fileRejections: FileRejection[];
  maxSize?: number;
  accept?: Accept;
}

export default function RejectionFiles({ fileRejections, maxSize, accept }: RejectionFilesProps) {
  const { t } = useTranslation();

  if (!fileRejections.length) {
    return null;
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
        borderColor: (theme) => alpha(theme.palette.error.main, 0.24),
      }}
    >
      {fileRejections.map(({ file, errors }) => {
        const { path, size } = fileData(file);

        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path} - {size ? fData(size) : ''}
            </Typography>

            {errors.map((error) => {
              let {message} = error;

              if (error.code === ErrorCode.FileTooLarge && maxSize) {
                message = t('file.max-size', { ns: 'validation', size: convertToMB(maxSize) });
              }

              if (error.code === ErrorCode.FileInvalidType && accept) {
                const types = Object.keys(accept);

                message = t('file.type', { ns: 'validation', type: types.join(', ') })
              }

              return (
                <Box key={error.code} component="div" sx={{ typography: 'body2' }}>
                  - {message}
                </Box>
              )
            })}
          </Box>
        );
      })}
    </Paper>
  );
}
