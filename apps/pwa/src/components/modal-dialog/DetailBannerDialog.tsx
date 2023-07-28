import { makeStyles } from '@material-ui/core';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, Stack, Typography } from '@mui/material';
import Image from 'components/Image';
import ModalDialog from 'components/modal-dialog';
import Space from 'components/space/space';
import { AdvertisingTapeList } from 'components/table/admin/system-messages/types';
import { useSelector } from 'redux/store';
import { formatCapitalizeText } from 'utils/formatCapitalizeText';
import useLocales from '../../hooks/useLocales';

const useStyles = makeStyles({
  gridContainer: {
    display: 'flex',
    flexDirectoin: 'row',
  },
  imageGrid: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});

type Props = {
  open: boolean;
  handleClose: () => void;
  message: string;
  data?: AdvertisingTapeList | null;
};

function DetailBannerDialog({ open, handleClose, message, data = null }: Props) {
  // console.log({ data });
  const classes = useStyles();
  const { translate } = useLocales();
  const { track_list } = useSelector((state) => state.proposal);

  return (
    <ModalDialog
      maxWidth="md"
      title={
        <Stack display="flex">
          <Typography variant="h6" fontWeight="bold" color="#000000">
            {translate(message)}
          </Typography>
        </Stack>
      }
      content={
        <>
          {data ? (
            <Grid className={classes.gridContainer}>
              {data?.logo && data?.logo.length > 0 ? (
                <Grid item className={classes.imageGrid} md={5} xs={12}>
                  {/* test1 */}
                  <Image
                    src={
                      (data?.logo && (data?.logo[0]?.url as string)) ||
                      'https://picsum.photos/200/300'
                    }
                    alt="logo"
                    sx={{ width: '150px ', height: '150px  ' }}
                  />
                </Grid>
              ) : null}
              <Grid item md={data?.logo && data?.logo.length > 0 ? 7 : 12} xs={12}>
                <Grid item md={12} xs={12}>
                  <Typography variant="h6" fontWeight="bold" color="#000000">
                    {translate('system_messages.dialog.title')}
                  </Typography>
                </Grid>
                <Grid item md={12} xs={12}>
                  <Typography variant="body1">{data?.title}</Typography>
                </Grid>
                <Space direction="horizontal" size="small" />
                <Grid item md={12} xs={12}>
                  <Typography variant="h6" fontWeight="bold" color="#000000">
                    {translate('system_messages.dialog.track')}
                  </Typography>
                </Grid>
                <Grid item md={12} xs={12}>
                  {/* Track */}
                  {/* {track_list.find((item) => item?.id === data?.track_id)?.name || '-'} */}
                  {`${formatCapitalizeText(
                    track_list.find((item) => item?.id === data?.track_id)?.name || '-'
                  )}`}
                </Grid>
                <Space direction="horizontal" size="small" />
                <Grid item md={12} xs={12}>
                  <Typography variant="h6" fontWeight="bold" color="#000000">
                    {translate('system_messages.dialog.content')}
                  </Typography>
                </Grid>
                <Grid item md={12} xs={12}>
                  {data?.content}
                </Grid>
                <Space direction="horizontal" size="small" />
              </Grid>
            </Grid>
          ) : null}
        </>
      }
      showCloseIcon={true}
      isOpen={open}
      onClose={handleClose}
      styleContent={{ padding: '1em', backgroundColor: '#fff' }}
    />
  );
}

export default DetailBannerDialog;
