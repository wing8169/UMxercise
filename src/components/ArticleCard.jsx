import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import sportsLogo from "./img/sports/1.jpg";

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
    return (
      <div>
        <Card className={classes.card}>
          <CardActionArea onClick={() => window.open(article.url, "_blank")}>
            <CardMedia
              className={classes.media}
              title="Article"
              style={{ textAlign: "center" }}
            >
              <img src={sportsLogo} alt="Article" style={{ height: "100%" }} />
            </CardMedia>
            <CardContent style={{ backgroundColor: "#a3edf7" }}>
              <Typography gutterBottom variant="h5" component="h2">
                {article.title}
              </Typography>
              <Typography component="p">{article.desc}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    );
  }
}

const ArticleCardStyled = withStyles(styles)(ArticleCard);

export default ArticleCardStyled;
