import { Button } from 'bootstrap'
import Project from './components/Project'

import axios from 'axios'

const token = document.head.querySelector('meta[name="csrf-token"]');
axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
