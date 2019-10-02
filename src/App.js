import React from "react";
import "./App.css";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import HelpIcon from "@material-ui/icons/Help";
import IconButton from "@material-ui/core/IconButton";

const axiosGitHubGraphQL = axios.create({
  baseURL: "https://api.github.com/graphql",
  headers: {
    //ToDO:ADD YOUR TOKEN NUMBER
    Authorization: "bearer <TOKEN>"
  }
});

const SEARCH_REPO = (owner, name) =>
  `{
     repository(owner: "${owner}", name: "${name}") {
       name
       nameWithOwner
       createdAt
       description 
       owner {
        id
        login
      }
      createdAt
      id   
      url
   }
  }
 `;

const App = () => {
  const [repoName, setRepoName] = React.useState("");
  const [ownerName, setOwnerName] = React.useState("");
  const [repoInfo, setRepoInfo] = React.useState();
  const [selectedState, setSelectedState] = React.useState(false);

  function handleSubmit() {
    axiosGitHubGraphQL
      .post("", { query: SEARCH_REPO(ownerName, repoName) })
      .then(result => {
        setRepoInfo(result.data.data.repository);
      });
  }
  function handleNameChange(evt) {
    setRepoName(evt.target.value);
  }
  function handleOwnerChange(evt) {
    setOwnerName(evt.target.value);
  }
  function handleMoreInfo() {
    setSelectedState(!selectedState);
  }
  return (
    <div className="App">
      <h1>React GraphQL GitHub</h1>

      <TextField
        label="Repo Name"
        value={repoName}
        onChange={handleNameChange}
        margin="normal"
      />
      <TextField
        label="Owner Name"
        value={ownerName}
        onChange={handleOwnerChange}
        margin="normal"
      />
      <Button variant="contained" onClick={handleSubmit}>
        Search
      </Button>

      {repoInfo != null ? (
        <Table style={{ width: "80%", margin: "auto" }}>
          <TableHead>
            <TableRow>
              <TableCell align="left">More Info</TableCell>

              <TableCell align="left">Repo Name</TableCell>
              <TableCell align="left">Repo Owner</TableCell>
              <TableCell align="left">Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <IconButton onClick={handleMoreInfo}>
                  <HelpIcon />
                </IconButton>
              </TableCell>
              <TableCell>{repoInfo.name}</TableCell>
              <TableCell>{repoInfo.owner.login}</TableCell>
              <TableCell>{repoInfo.description}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : null}
      {selectedState ? (
        <div style={{ padding: "8px" }}>
          <h3>More info</h3>
          <div> Created At -{repoInfo.createdAt}</div>
          <div> Id -{repoInfo.id}</div>
          <div> URL -{repoInfo.url}</div>
        </div>
      ) : null}
    </div>
  );
};

export default App;
