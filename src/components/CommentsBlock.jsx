import React from "react";

import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import axios from "../axios";
import { useParams } from "react-router-dom";
import styles from "./AddComment/AddComment.module.scss";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";

export const CommentsBlock = ({ items, children = true }) => {
  const { id } = useParams();
  const [isLoading, setLoading] = React.useState(true);
  const [comments, setComments] = React.useState(null);
  const [text, setText] = React.useState("");
  const avatarUrl = useSelector((state) => state.auth?.data?.avatarUrl);
  const fullName = useSelector((state) => state.auth?.data?.fullName);

  const onSubmit = async () => {
    try {
      const field = {
        id,
        fullName,
        avatarUrl,
        text,
      };
      await axios.post("/comments", field);
      await axios.get(`/comments/${id}`).then(({ data }) => {
        setComments(data);
        setText("");
      });
    } catch (e) {}
  };

  React.useEffect(() => {
    axios.get(`/comments/${id}`).then(({ data }) => {
      setComments(data);
      setLoading(false);
      console.log(data);
    });
  }, []);

  return (
    <>
      <SideBlock title="Комментарии">
        <List>
          {(isLoading ? [...Array(5)] : comments).map((obj, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  {isLoading ? (
                    <Skeleton variant="circular" width={40} height={40} />
                  ) : (
                    <Avatar
                      alt={obj.fullName}
                      src={obj.avatarUrl ? obj.avatarUrl : ""}
                    />
                  )}
                </ListItemAvatar>
                {isLoading ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Skeleton variant="text" height={25} width={120} />
                    <Skeleton variant="text" height={18} width={230} />
                  </div>
                ) : (
                  <ListItemText primary={obj.fullName} secondary={obj.text} />
                )}
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
        {fullName ? (
          <div className={styles.root}>
            <Avatar
              classes={{ root: styles.avatar }}
              src={avatarUrl ? `${avatarUrl}` : ""}
            />
            <div className={styles.form}>
              <TextField
                label="Написать комментарий"
                variant="outlined"
                maxRows={10}
                value={text}
                onChange={(e) => setText(e.target.value)}
                multiline
                fullWidth
              />
              <Button onClick={onSubmit} variant="contained">
                Отправить
              </Button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </SideBlock>
    </>
  );
};
