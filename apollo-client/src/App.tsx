import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  useSubscription,
} from 'react-apollo';
import gql from 'graphql-tag';


const message_sub = gql`
   subscription messageAdded {
    subscribeToDomainCrawlEvents(domainUrl: "https://www.techseekr.io/") {
      url
      status
      totalScraped
    }
  }
 `;

const oldMessages: any[] = [];
const Messages = () => {
  const { data, loading } = useSubscription(
    message_sub, {}
  );
  if (data) oldMessages.unshift(data);
  return loading ? <div>loading</div > :
    <>{
      oldMessages.map(x => <p>
        <label>{x.subscribeToDomainCrawlEvents.url}</label>
        <br/>
        <br/>
        <label>{x.subscribeToDomainCrawlEvents.status}</label>
        <br/>
        <br/>
        <label>Total Scraped: {x.subscribeToDomainCrawlEvents.totalScraped}</label>
      </p>)}
    </>
    ;
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <Messages />
        </p>
      </header>
    </div >
  );
}

export default App;
