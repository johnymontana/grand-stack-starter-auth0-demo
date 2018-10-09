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

class AdminView extends React.Component {
  render() {
    return (
      <div>
        <Paper className={this.props.classes.root}>
          <Typography variant="display1" gutterBottom component="h2">
            Business List
          </Typography>
          <Typography>
            View business information in a table. Note only users authenticated
            with "admin" role can view this data!
          </Typography>
          <Query
            query={gql`
              query businessQuery($first: Int, $city: String) {
                Business(first: $first, city: $city) {
                  id
                  name
                  address
                  city
                  state
                }
              }
            `}
            variables={{
              first: 10,
              city: "Phoenix"
            }}
          >
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) {
                console.log(error);
                return <Typography variant="display2" color="error">Error: You are not authorized.</Typography>;
              }
              console.log(data);

              return (
                <Table className={this.props.classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell key="name">Name</TableCell>
                      <TableCell key="address">Address</TableCell>
                      <TableCell key="city">City</TableCell>
                      <TableCell key="state">State</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.Business.map(n => {
                      return (
                        <TableRow key={n.id}>
                          <TableCell component="th" scope="row">
                            {n.name}
                          </TableCell>
                          <TableCell>{n.address}</TableCell>
                          <TableCell>{n.city}</TableCell>
                          <TableCell>{n.state}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              );
            }}
          </Query>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(AdminView);