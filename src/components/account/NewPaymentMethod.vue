<template>
  <div class="main">
    <form id="payment-form">
      <input
        id="customer-input"
        type="text"
        aria-required="true"
        aria-label="Customer ID"
        required="required"
        placeholder="Customer ID"
        name="customerId"
        v-model="customer_id"
      />
      <div id="card-container" style="margin-top: 0"></div>
      <div class="authorization">
          <input type="checkbox" name="" id="customer_authorization" v-model="authorized" required>
          <label for="customer_authorization">I authorize Ultimate-RV to automatically apply payments according to my selected Ultimate-RV plan</label>
        </div>
      <button id="card-button" type="button" disabled>Store Card</button>
    </form>
    <div id="payment-status-container" class="store-card-message"></div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "NewPaymentMethod",
  data() {
    return {
      customer_id: null,
      app_id: null,
      token: null,
      location: null,
      authorized:false
    };
  },
  mounted(){
      window.squarewindow = this;
  },
  created() {
    axios({
      url:
        process.env.VUE_APP_BACKEND_CONNECTION_URI +
        "/system/getSquareSystemInfo",
      method: "get",
    }).then((res) => {
      this.customer_id = res.data.account_id;
      this.app_id = res.data.app_id;
      this.token = res.data.token;
      this.location = res.data.location;

      this.$loadScript(res.data.frontend_script).then(async() => {
        if (!window.Square) {
          throw new Error('Square.js failed to load properly');
        }
        
        let payments;
        try {
          payments = window.Square.payments(this.app_id, this.location);
        } catch {
          const statusContainer = document.getElementById(
            'payment-status-container'
          );
          statusContainer.className = 'missing-credentials';
          statusContainer.style.visibility = 'visible';
          return;
        }
        let card;
        try {
          card = await window.squarewindow.initializeCard(payments);
        } catch (e) {
          console.error('Initializing Card failed', e);
          return;
        }
        
        async function handleStoreCardMethodSubmission(
          event,
          paymentMethod,
          customerId
        ) {
          event.preventDefault();

          try {
            // disable the submit button as we await tokenization and make a payment request.
            cardButton.disabled = true;
            const token = await window.squarewindow.tokenize(paymentMethod);

            let verificationToken = await window.squarewindow.verifyBuyer(payments, token);
            const storeCardResults = await window.squarewindow.storeCard(
              token,
              customerId,
              verificationToken
            );

            window.squarewindow.displayResults('SUCCESS');
            console.debug('Store Card Success', storeCardResults);
          } catch (e) {
            //   console.log(e)
            cardButton.disabled = false;
            window.squarewindow.displayResults('FAILURE');
            // console.error('Store Card Failure', e);
          }
        }
        const cardButton = document.getElementById('card-button');
        const authCheckbox = document.getElementById('customer_authorization');
        authCheckbox.addEventListener('change', async function(event){
            cardButton.disabled = !window.squarewindow.authorized;
        });
       
        cardButton.addEventListener('click', async function (event) {
          const textInput = document.getElementById('customer-input');
          if (!textInput.reportValidity()) {
            return;
          }

          const customerId = textInput.value;
          handleStoreCardMethodSubmission(event, card, this.customer_id);
        });

      });
    });
  },
  methods:{
      async initializeCard(payments) {
        const card = await payments.card();
        await card.attach('#card-container');

        return card;
      },
      async tokenize(paymentMethod) {
        const tokenResult = await paymentMethod.tokenize();
        if (tokenResult.status === 'OK') {
          return tokenResult.token;
        } else {
          throw new Error(
            `Tokenization errors: ${JSON.stringify(tokenResult.errors)}`
          );
        }
      },
      async verifyBuyer(payments, token) {
        const verificationDetails = {
          billingContact: {
            addressLines: ['123 Main Street', 'Apartment 1'],
            familyName: 'Doe',
            givenName: 'John',
            email: 'jondoe@gmail.com',
            country: 'GB',
            phone: '3214563987',
            region: 'LND',
            city: 'London',
          },
          intent: 'STORE',
        };

        const verificationResults = await payments.verifyBuyer(
          token,
          verificationDetails
        );
        return verificationResults.token;
      },
      async storeCard(token, customerId, verificationToken) {
        // const bodyParameters = {
        //   locationId:this.location,
        //   sourceId: token,
        //   customerId,
        //   verificationToken,
        // };

        // const body = JSON.stringify(bodyParameters);
        // console.log(body)

        axios({
            url:process.env.VUE_APP_BACKEND_CONNECTION_URI + "/addUserAccountPaymentMethod",
            method:'post',
            data:{
                account_id:this.customer_id,
                location_id:this.location,
                source_id:token,
                verification_token:verificationToken
            }
        }).then((res)=>{
            // console.log(res)
            this.$$emit("updateParent",res.data.payment_methods)
        })
        // const paymentResponse = await fetch('/card', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body,
        // });

        // if (paymentResponse.ok) {
        //   return paymentResponse.json();
        // }

        // const errorBody = await paymentResponse.text();
        // throw new Error(errorBody);
      },
      displayResults(status) {
        const statusContainer = document.getElementById(
          'payment-status-container'
        );
        if (status === 'SUCCESS') {
          statusContainer.classList.remove('is-failure');
          statusContainer.classList.add('is-success');
        } else {
          statusContainer.classList.remove('is-success');
          statusContainer.classList.add('is-failure');
        }
        statusContainer.innerHTML = status
        statusContainer.style.visibility = 'visible';
      }
  }
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}
div.main {
  border: solid 1px rgba(71, 71, 71, 0.8);
  border-radius: 0.5rem;
}

#payment-form {
  max-width: 550px;
  min-width: 300px;
  margin: 150px auto;
}
#customer-input {
  margin-bottom: 40px;
  display: none;
}
#card-container {
  margin-top: 45px;
  /* this height depends on the size of the container element */
  /* We transition from a single row to double row at 485px */
  /* Settting this min-height minimizes the impact of the card form loading */
  min-height: 90px;
}
button {
  color: #ffffff;
  background-color: #006aff;
  border-radius: 5px;
  cursor: pointer;
  border-style: none;
  user-select: none;
  outline: none;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  padding: 12px;
  width: 100%;
  box-shadow: 1px;
}

button:active {
  background-color: rgb(0, 85, 204);
}

button:disabled {
  background-color: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.3);
}
div.authorization{
    font-size:0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom:0.5rem;
}
</style>