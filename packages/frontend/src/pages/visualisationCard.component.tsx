import { Card, CardContent, Link, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            minWidth: 275,
            padding: theme.spacing(2),
            textAlign: 'left',
        },
    }),
);

interface VisualisationCardProps {
    runId: string;
    visualisationName: string;
    displayName: string;
}

const VisualisationCard = (props: VisualisationCardProps): React.ReactElement => {
    const classes = useStyles();

    const { runId, visualisationName, displayName } = props;

    // TODO: Use a standard link instead of a react-router link: https://material-ui.com/components/links/
    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography variant="h5" component="h2">
                    {/* <Link component={RouterLink} to={`/runs/${runId}/visualisations/${visualisationName}/data`}> */}
                    <Link href={`/runs/${runId}/visualisations/${visualisationName}/data`}>{displayName}</Link>
                </Typography>
            </CardContent>
        </Card>
    );
};

export default VisualisationCard;
