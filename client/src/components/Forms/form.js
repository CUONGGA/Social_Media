import React, { useState, useEffect, useRef } from "react";
import useStyle from './styles.js';
import { useSelector } from 'react-redux';
import { TextField, Button, Typography, Paper } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { createPost, updatePost } from '../../actions/posts.js'

const Form = ({ currentId, setCurrentId }) => {
    const [postData, setPostData] = useState({ title: '', message: '', tags: [], selectedFile: '' })
    /* Lưu CHÍNH XÁC chuỗi user gõ ở field Tags để dấu `,` và khoảng trắng
       hiển thị bình thường khi đang nhập. Nếu chỉ derive từ `postData.tags`
       (array đã parse) thì `["a"].join(', ') === "a"` — separator bị nuốt
       ngay sau mỗi phím, user tưởng phím space/phẩy "hỏng". */
    const [tagsInput, setTagsInput] = useState('')
    const [pickedFileLabel, setPickedFileLabel] = useState('')
    const fileInputRef = useRef(null)
    const post = useSelector((state) => currentId ? state.posts.posts.find((p) => p._id === currentId) : null);
    const classes = useStyle();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const history = useHistory();

    useEffect(() => {
        if (post) {
            setPostData(post)
            setTagsInput(Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''))
            setPickedFileLabel(post.selectedFile ? 'Image attached' : '')
        }
    }, [post])

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
            setPostData((prev) => ({ ...prev, selectedFile: reader.result }))
            setPickedFileLabel(file.name)
        }
        reader.readAsDataURL(file)
    }

    const openFilePicker = () => fileInputRef.current?.click()

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (currentId) {
            dispatch(updatePost(currentId, {...postData, name: user?.result?.name}, history));
            clear();
        } else {
            dispatch(createPost({...postData, name: user?.result?.name}, history));
            clear();
        }
    };

    if(!user?.result?.name) {
        return (
            <Paper className={classes.paper}>
                <Typography variant="h6" align="center" color="textPrimary">
                    Please Sign In to create your own memories and like other's memories.
                </Typography>
            </Paper>
        )
    };

    const clear = () => {
        setCurrentId(null);
        setPostData({ title: '', message: '', tags: [], selectedFile: '' });
        setTagsInput('');
        setPickedFileLabel('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    /* Mỗi lần user gõ Tags: lưu nguyên văn vào `tagsInput` (để render),
       đồng thời parse sang array (split theo `,` + whitespace, bỏ chuỗi rỗng)
       cập nhật `postData.tags` → submit lúc nào cũng sẵn dữ liệu sạch. */
    const handleTagsChange = (e) => {
        const raw = e.target.value;
        setTagsInput(raw);
        setPostData((prev) => ({
            ...prev,
            tags: raw.split(/[,\s]+/).filter(Boolean),
        }));
    }

    return (
        <Paper className={classes.paper} elevation={6}>
            <form autoComplete="off" noValidate className={`${classes.form} ${classes.root}`} onSubmit={handleSubmit}>
            <Typography className={classes.titleTypography} component="h2">
                { currentId ? 'Editing' : 'Creating' } a Memory
            </Typography>
            <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value})}/>
            <TextField name="message" variant="outlined" label="Message" fullWidth multiline rows={3} value={postData.message} onChange={(e) => setPostData({ ...postData, message: e.target.value})}/>
            <TextField
                name="tags"
                variant="outlined"
                label="Tags"
                fullWidth
                placeholder="vacation family travel"
                value={tagsInput}
                onChange={handleTagsChange}
            />
            <div className={classes.fileInput}>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className={classes.fileInputHidden}
                    onChange={handleFileChange}
                />
                <Button type="button" className={classes.chooseFileButton} variant="outlined" disableElevation onClick={openFilePicker}>
                    Choose file
                </Button>
                <Typography className={classes.fileHint} variant="body2" noWrap component="span" title={pickedFileLabel || undefined}>
                    {pickedFileLabel || (postData.selectedFile ? 'Image attached' : 'No file chosen')}
                </Typography>
            </div>
            <div className={classes.actionsRow}>
                <Button className={classes.buttonSubmit} type="submit" variant="contained" color="primary" disableElevation>
                    Submit
                </Button>
                <Button className={classes.clearButton} type="button" variant="outlined" color="default" onClick={clear} disableElevation>
                    Clear
                </Button>
            </div>
            </form>
        </Paper>
    )
}

export default Form;