import React from "react";
import {
  Container,
  Input,
  FormGroup,
  Label,
  ListGroup,
  ListGroupItem,
  Form
} from "reactstrap";
import { useLocalStore, useObserver } from "mobx-react";

const StoreContext = React.createContext();

const StoreProvider = ({ children }) => {
  const store = useLocalStore(() => ({
    fruits: ["Apple", "Banana", "Grapes"],
    addFruit: fruit => store.fruits.push(fruit),
    removeFruit: index => store.fruits.splice(index, 1)
  }));

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

function useStore() {
  const store = React.useContext(StoreContext);
  return store;
}

function FruitHeader() {
  return (
    <>
      <h1 className="text-center">Fruits App</h1>
      <hr className="bg-light" />
    </>
  );
}

function Fruits() {
  const store = useStore();

  return useObserver(() => (
    <ListGroup className="mt-5">
      {store.fruits.sort().map((fruit, index) => (
        <ListGroupItem key={fruit}>
          <span className="text-dark">{fruit}</span>
          <i
            className="close float-right"
            onClick={() => store.removeFruit(index)}
          >
            &#10799;
          </i>
        </ListGroupItem>
      ))}
    </ListGroup>
  ));
}

function FruitForm() {
  const store = useStore();
  const [fruit, setFruit] = React.useState("");

  const _onSubmit = e => {
    e.preventDefault();
    store.addFruit(fruit);
    setFruit("");
  };

  return (
    <Form onSubmit={_onSubmit} className="mt-5">
      <FormGroup>
        <Label>Fruit Name</Label>
        <Input
          required
          value={fruit}
          onChange={e => setFruit(e.currentTarget.value)}
        />
      </FormGroup>
    </Form>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Container className="my-5 p-5 bg-dark text-light rounded-lg">
        <FruitHeader />
        <FruitForm />
        <Fruits />
      </Container>
    </StoreProvider>
  );
}
