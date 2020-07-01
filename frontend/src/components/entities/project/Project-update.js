import React, {Component, useState, useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import {tokenConfig, BASE_API} from "../index";
import ProjectEditor from './ProjectEditor';


function ProjectUpdate(props) {

    const [project, setProject] = React.useState({});
    const [isNewProject, setNew] = React.useState(!props.match.params || !props.match.id);

    useEffect(() => {
        console.log("use effect of is new is called");
        const isNew = !props.match.params || !props.match.params.id;
        setNew(isNew);
    });


    useEffect(() => {
        if (!isNewProject) {
            console.log(isNewProject);
            const id = props.match.params.id;
            axios.get(`${BASE_API}projects/${id}`, tokenConfig())
                .then(response => setProject(response.data))
                .catch(error => console.log(error));
        } else {
            setProject({});
        }
    }, [isNewProject]);


    const cancel = () => {
        props.history.push("/project")
    };

    return (
        <ProjectEditor project={project} cancel={cancel}/>
    );
}


ProjectUpdate.propTypes = {};


export default ProjectUpdate;
