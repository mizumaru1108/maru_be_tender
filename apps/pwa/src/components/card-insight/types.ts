import { GridSpacing } from '@mui/material';
import { ResponsiveStyleValue } from '@mui/system';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

export type CardInsightProps = {
  data: {
    title?: string | null;
    value?: number | 0;
  }[];
  headline?: string | null;  
  cardContainerSpacing?: ResponsiveStyleValue<GridSpacing>;
  cardContainerColumns?: ResponsiveStyleValue<number>;
  cardItemXsBreakpoints?: number;
  cardItemSmBreakpoints?: number;
  cardItemMdBreakpoints?: number;
  cardStyle?: SxProps<Theme>;
  icon?: string | null;
  iconPosition?: 'left' | 'right';
};
