import { List } from '@material-ui/core';
import { fetchRuns, RegisterRoutePayload, StateType } from 'frontend-common';
import React from 'react';
import { connect } from 'react-redux';

interface VisualisationsPageProps {
    runId: string;
}

// interface VisualisationPageDispatchProps {
//     fetchRuns: () => Promise<void>;
// }

interface VisualisationsPageStateProps {
    plugins: RegisterRoutePayload[];
}

type VisualisationsPageCombinedProps = VisualisationsPageProps & VisualisationsPageStateProps;

const VisualisationsPage = (props: VisualisationsPageCombinedProps): React.ReactElement => {
    const { runId, plugins } = props;

    const [runsFetched, setRunsFetched] = React.useState(false);

    React.useEffect(() => {
        if (!runsFetched) {
            // Call to fetch runs.
            fetchRuns();
            setRunsFetched(true);
        }
    }, [runsFetched]);

    return (
        <div>
            <List>
                {/* {plugins.map(
                    (p, i) =>
                        graphs.includes(p.plugin) && (
                            <ListItem key={i}>
                                <VisualisationCard />
                            </ListItem>
                        ),
                )} */}
            </List>
        </div>
    );
};

// const mapDispatchToProps = (dispatch: ThunkDispatch<StateType, null, AnyAction>): RunsPageDispatchProps => ({
//     fetchRuns: () => dispatch(fetchRuns()),
// });

const mapStateToProps = (state: StateType): VisualisationsPageStateProps => {
    return {
        plugins: state.frontend.configuration.plugins,
    };
};

export default connect(mapStateToProps)(VisualisationsPage);
