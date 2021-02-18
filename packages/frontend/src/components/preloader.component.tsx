import { StateType } from 'frontend-common';
import React from 'react';
import { connect } from 'react-redux';

interface PreloaderProps {
    loading: boolean;
    children: React.ReactNode;
}

const Preloader = (props: PreloaderProps) => <div>{props.loading ? <div>Loading...</div> : props.children}</div>;

const mapStateToProps = (state: StateType): { loading: boolean } => {
    return { loading: !state.frontend.configuration.settingsLoaded };
};

export default connect(mapStateToProps)(Preloader);
