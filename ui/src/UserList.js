import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import "./UserList.css";
import { withStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography
} from "@material-ui/core";

const styles = theme => ({
  root: {
    maxWidth: 700,
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    margin: "auto"
  },
  table: {
    minWidth: 700
  }
});

class UserList extends React.Component {
  render() {
    return (
      <div>
        <Paper className={this.props.classes.root}>
          <Typography variant="display1" gutterBottom component="h2">
            User List
          </Typography>
          <Typography>
            View a table of user data. Note you must be authenticated to view
            this data!
          </Typography>

          <Query
            query={gql`
              query usersQuery($first: Int) {
                User(first: $first) {
                  id
                  name
                  avgStars
                  numReviews
                }
              }
            `}
            variables={{
              first: 10
            }}
          >
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <Typography variant="display2" color="error">Error: You must log in</Typography>;
              return (
                <Paper className={this.props.classes.root}>
                  <Table className={this.props.classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell key="name">Name</TableCell>
                        <TableCell key="avgStars" numeric>
                          Average Stars
                        </TableCell>
                        <TableCell key="numReviews" numeric>
                          Number of Reviews
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.User.map(n => {
                        return (
                          <TableRow key={n.id}>
                            <TableCell component="th" scope="row">
                              {n.name}
                            </TableCell>
                            <TableCell numeric>
                              {n.avgStars ? n.avgStars.toFixed(2) : "-"}
                            </TableCell>
                            <TableCell numeric>{n.numReviews}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Paper>
              );
            }}
          </Query>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(UserList);
