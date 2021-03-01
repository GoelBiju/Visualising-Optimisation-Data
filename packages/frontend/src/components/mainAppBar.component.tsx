import { AppBar, CssBaseline, Link, Toolbar, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
        },
    }),
);

const MainAppBar = (): React.ReactElement => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        <Link href="/" color="inherit" underline="none">
                            Visualising Optimisation Data
                        </Link>
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default MainAppBar;
