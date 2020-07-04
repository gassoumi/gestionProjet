import React, {useState, useEffect} from 'react';
import axios from "axios";
import {tokenConfig, BASE_API} from "../index";
import ProjectEditor from './ProjectEditor';


function ProjectUpdate(props) {

    const [project, setProject] = useState({});
    const isNewProject = !props.match.params || !props.match.params.id;

    useEffect(() => {
        //console.log(isNewProject);
        if (!isNewProject) {
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
        <ProjectEditor project={project} isNew={isNewProject} cancel={cancel}/>
    );
}


export default ProjectUpdate;
