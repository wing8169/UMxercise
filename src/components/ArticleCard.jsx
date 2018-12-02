import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

import img1 from "./img/articles/1.jpg";
import img2 from "./img/articles/2.jpeg";
import img3 from "./img/articles/3.jpg";
import img4 from "./img/articles/4.jpg";
import img5 from "./img/articles/5.jpg";
import img6 from "./img/articles/6.jpg";
import img7 from "./img/articles/7.jpg";
import img8 from "./img/articles/8.jpg";
import img9 from "./img/articles/9.jpg";
import img10 from "./img/articles/10.jpg";

// Article Card
const styles = {
  card: {
    maxWidth: 345,
    boxShadow: "0 8px 6px -6px black"
  },
  media: {
    height: 200
  }
};

class ArticleCard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { classes, article } = this.props;
    let img;
    switch (article.img) {
      case "1":
        img = img1;
        break;
      case "2":
        img = img2;
        break;
      case "3":
        img = img3;
        break;
      case "4":
        img = img4;
        break;
      case "5":
        img = img5;
        break;
      case "6":
        img = img6;
        break;
      case "7":
        img = img7;
        break;
      case "8":
        img = img8;
        break;
      case "9":
        img = img9;
        break;
      case "10":
        img = img10;
        break;
    }
    return (
      <div>
        <Card className={classes.card}>
          <CardActionArea onClick={() => window.open(article.url, "_blank")}>
            <CardMedia
              className={classes.media}
              title="Article"
              style={{ textAlign: "center" }}
            >
              <img src={img} alt="Article" style={{ height: "100%" }} />
            </CardMedia>
            <CardContent style={{ backgroundColor: "#a3edf7" }}>
              <Typography
                variant="p"
                component="p"
                style={{
                  color: "#750000",
                  textAlign: "center",
                  fontSize: "1rem"
                }}
              >
                {article.title}
              </Typography>
              <Typography component="p" style={{ textAlign: "right" }}>
                —— {article.desc}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    );
  }
}

const ArticleCardStyled = withStyles(styles)(ArticleCard);

export default ArticleCardStyled;
