import React from "react";
import { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Typography, Paper, Input, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const styles = theme => ({
  root: {
    maxWidth: 700,
    margin: "auto",
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  input: {
    margin: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  }
});

class StarSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: "Beer"
    };
    this.searchInput = React.createRef();
  }

  updateSearch = () => {
    this.setState({
      searchString: this.searchInput.value
    });
  };

  render() {
    return (
      <div>
        <Paper className={this.props.classes.root}>
          <Typography variant="display1" gutterBottom component="h2">
            Star Summary
          </Typography>
          <Typography>
            Search for categories and view distribution of review stars for all
            reviews of businesses in that category. Anyone can view this data.
          </Typography>
          <Input
            defaultValue={this.state.searchString}
            className={this.props.classes.input}
            inputProps={{
              "aria-label": "Description"
            }}
            inputRef={input => {
              this.searchInput = input;
            }}
          />
          <Button
            variant="contained"
            color="primary"
            className={this.props.classes.button}
            onClick={this.updateSearch}
          >
            Update
          </Button>
          <Query
            query={gql`
              query starsByCategoryQuery($searchString: String) {
                starsByCategory(category: $searchString) {
                  star
                  count
                }
              }
            `}
            variables={{ searchString: this.state.searchString }}
          >
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) {
                console.log(error);
                return <Typography variant="display2" color="error">Error: Something went wrong.</Typography>;
              }

              return (

                <BarChart
                  width={600}
                  height={300}
                  data={data.starsByCategory}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="star" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                  
                </BarChart>
              );
            }}
          </Query>
        </Paper>
      </div>
    );
  }
}
export default withStyles(styles)(StarSummary);
