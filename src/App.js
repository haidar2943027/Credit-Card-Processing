import React, { Component } from 'react';
import axios from "axios";
import './App.css';
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            card: '',
            limit: '',
            data: [],
            response: '',
            messageValid: true,
            errorName: true,
            cardError: true,
            limitError: true,
            formValid: false
        }
        this.apiUrl = 'http://localhost:3001/api/'
        this.validCreditCard = this.validCreditCard.bind(this);
        this.validateName = this.validateName.bind(this);
        this.validateLimit = this.validateLimit.bind(this);
        this.updateState = this.updateState.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.checkFormValidation = this.checkFormValidation.bind(this)
        this.getCardsList = this.getCardsList.bind(this)
        this.addCard = this.addCard.bind(this)
        this.getCardsList()
    };
    /* Get the credit cards list */
    getCardsList() {
        try {
            axios.get(this.apiUrl+'cards_list')
                .then(data => this.setState({data: data.data.data}))
                .catch(error => console.log(error)) 
        } catch (error) {
            console.log('error', error)
        }
    }
    /* Add the credit card */
    addCard(data, e) {
        try {
            axios.post(this.apiUrl+'add_card', data)
                .then(data => {
                    this.setState({response: data.data})
                    setTimeout(this.showMessage(data.data.message, e), 100);
                })
                .catch(error => console.log(error)) 
        } catch (error) {
            console.log('error', error)
        }
    }
    /* Credit card validation with luhn Algorithm */
    validCreditCard(value) {
          if (/^[0-9]{13,19}$/.test(value)) {
            /* Luhn Algorithm */
            let nCheck = 0, bEven = false;
            value = value.replace(/\D/g, "");
            for (var n = value.length - 1; n >= 0; n--) {
                var cDigit = value.charAt(n),
                        nDigit = parseInt(cDigit, 10);
                if (bEven && (nDigit *= 2) > 9) nDigit -= 9;
                nCheck += nDigit;
                bEven = !bEven;
            }
            return (nCheck % 10) == 0;
        } else {
            return false
        }
      }
    /* Name string validation */
    validateName(input) {
        if(input.length >= 2) {
            return true;
        } return false;
    }
    /* Limit validation */
    validateLimit(input) {
        if(input < 1) return false
        var regexp = /^[0-9]{1,8}$/;
        return regexp.test(input);
    }
    /* Show APIs reponse messages */
    showMessage(message, e) {
        if(message) {
            this.setState({messageValid: message});
            if(this.state.response["statusCode"] === 200) {
                document.getElementById('message').style.color = "green";
            } else {
                document.getElementById('message').style.color = "red";
            }
        } else {
            this.setState({messageValid: ''});
        }
    }

    /* Updates the state by taking in an event, a validator function (i.e validateName, validateLimit), 
    and an error name to update the state of. Note: class name and state name are the same*/
    updateState(e, validatorFunction, errorName) {
            this.showMessage('', e)
            setTimeout(this.checkFormValidation, 100);
            if (validatorFunction === true) {
                this.setState({[e.target.classList[0]]: e.target.value});
                this.setState({[errorName]: 'Valid'});
                document.getElementById(e.target.classList[0]).style.color = "green";
            }
            else if (e.target.value.length === 0) {
                this.setState({[errorName]: 'Empty submission'});
                document.getElementById(e.target.classList[0]).style.color = "red";
            }
            else {
                this.setState({[errorName]: 'Invalid form input'});
                document.getElementById(e.target.classList[0]).style.color = "red";
            }
    }
    /* Handling the add credit card form submission */
    handleSubmit(e) {
        if(this.state.formValid) {
        let body = {name: this.state.name, cardNumber: this.state.card, limit: this.state.limit}
        this.addCard(body, e)
        this.getCardsList()
        }
    }
    /* Form validation */
    checkFormValidation(){
        this.setState({formValid: false});
        if(this.state.cardError == 'Valid' && this.state.nameError == 'Valid' && this.state.limitError == 'Valid' ) {
            this.setState({formValid: true});
        }
    }


  render() {
    return (
      <div className="App">
        <h4>Credit Card System</h4>
        <h6>Add</h6>
        {/* Add credit card form */}
          <form onSubmit={this.handleSubmit}>
               Name <br/>
              <input className="name" type="text"id="input-text-sm"
                     onChange={(event) => this.updateState(event, this.validateName(event.target.value), "nameError")}/>
              <p id="name">  {this.state.nameError} </p> <br/>
              Card number <br/>
              <input className="card" type="text"
                     onChange={(event) => this.updateState(event, this.validCreditCard(event.target.value), "cardError")}/>
              <p id="card">  {this.state.cardError} </p> <br/>
              Limit <br/>
              <input className="limit" type="text"
                     onChange={(event) => this.updateState(event, this.validateLimit(event.target.value), "limitError")}/>
              <p id="limit">  {this.state.limitError} </p> <br/>
              <button type = 'submit' disabled={!this.state.formValid} className='btn'>Add</button><br/><br/>
              <p id='message'>{this.state.messageValid}</p>
          </form>
          <br/> <br/>
          {/* Credit cards list */}
          <h6>Existing Cards</h6>
          <table>
            <tr>
            <th>Name</th>
            <th>Card Number</th>
            <th>Balance</th>
            <th>Limit</th>
            </tr>
            {this.state.data.map((val, key) => {
            return (
                <tr key={key}>
                <td>{val.name}</td>
                <td>{val.cardNumber}</td>
                <td style={{ color: val.balance < 0 ? "red" : "#5d5d5d" }}><span>&#163;</span> {val.balance}</td>
                <td><span>&#163;</span>{val.limit}</td>
                </tr>
            )
            })}
          </table>
      </div>
    );
  }
}

export default App;
