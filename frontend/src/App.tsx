import {
    AppBar,
    CssBaseline,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Toolbar,
    Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import './App.css';
import DetailScatterPlot from './graphs/scatter/detailScatterPlot.component';

const drawerWidth = 200;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        toolbar: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            padding: theme.spacing(3),
        },
    }),
);

function App() {
    const classes = useStyles();

    const [selectedScatter, setSelectedScatter] = React.useState(true);

    return (
        <div className="App">
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" noWrap>
                            Visualising Optimisation Data
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    anchor="left"
                >
                    <div className={classes.toolbar} />
                    <Divider />
                    <List>
                        {['Scatter Plot'].map((text) => (
                            <ListItem button onClick={() => setSelectedScatter(true)} key={text}>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>

                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {/* <BarChart /> */}
                    {/* <ScatterPlot /> */}
                    {selectedScatter && <DetailScatterPlot />}
                    {/* <DetailBarChart /> */}
                </main>
            </div>
        </div>
    );
}

export default App;
