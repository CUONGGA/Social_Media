import React, { useEffect } from 'react';
import { Paper, Typography, CircularProgress, Divider } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import useStyles from './styles.js';
import { getPost } from '../../actions/posts.js';
import { useParams } from 'react-router-dom';



const PostDetails = () => {
    console.log('PostDetails');
  return (
    <div>
        PostDetails
    </div>
  )
}

export default PostDetails