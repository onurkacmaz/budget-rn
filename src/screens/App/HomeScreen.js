import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { Icon } from "@rneui/themed";
import Button from '../../components/Button';
import ActionSheet, { useScrollHandlers } from "react-native-actions-sheet";
import DatePicker from 'react-native-modern-datepicker';
import Toast from '../../components/Toast';
import { Menu } from 'react-native-paper';
import { useEffect } from 'react';
import WalletApi from '../../store/WalletApi'
import TransactionApi from '../../store/TransactionApi'
import Header from '../../components/Header';

const HomeScreen = ({route, navigation}) => {
  const actionSheetRef = useRef(null);
  const transactionActionSheetRef = useRef(null);
  const [type, setType] = useState(null)
  const [selectedDate, setSelectedDate] = useState('');
  const [amount, setAmount] = useState(0);
  const [transactions, setTransactions] = useState([])
  const [status, setStatus] = useState(null)
  const [message, setMessage] = useState(null)
  const [visible, setVisible] = useState(false)
  const [balanceMenuVisible, setBalanceMenuVisible] = useState(false)
  const [transactionsMenuVisible, setTransactionsMenuVisible] = useState(false)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [balance, setBalance] = useState(0)
  const [allTransactions, setAllTransactions] = useState([])

  const scrollHandlers = useScrollHandlers(
    'transactionsActionSheet',
    transactionActionSheetRef,
  );

  const handleOpenAddIncomeOrExpenseActionSheet = (type) => {
    setType(type);
    actionSheetRef.current?.show();
  }

  const handleAction = () => {
    if(amount == "") {
      setStatus("error")
      setMessage("Amount field is required.")
      setVisible(true)

      setTimeout(() => {
        setVisible(false)
      }, 3000)
      return;
    }

    if(selectedDate == "") {
      setStatus("error")
      setMessage("Date field is required.")
      setVisible(true)

      setTimeout(() => {
        setVisible(false)
      }, 3000)
      return;
    }

    switch(type) {
      case "income": 
        addIncome()
      break;
      case "expense":
        addExpense()
      break;
    }
    setAmount(0);
    setSelectedDate(null);
    setType(null);
    setVisible(false)
    actionSheetRef.current.hide()
  }
  
  const addIncome = () => {
    var amountFormatted = amount.replace(",", ".")
    TransactionApi.create('income', amountFormatted, selectedDate).finally(() => {
      refreshBalance()
      refreshTransactions()
    })
  }

  const addExpense = () => {
    var amountFormatted = amount.replace(",", ".")
    TransactionApi.create('expense', amountFormatted, selectedDate).finally(() => {
      refreshBalance()
      refreshTransactions()
    })
  }

  const refreshTransactions = (limit = 20) => {
    setTransactionsLoading(true)
    setTransactionsMenuVisible(false)
    initTransactions(limit).then(r => {
      setTransactions(r.data)
    }).finally(() => {
      setTransactionsLoading(false)
    })
    refreshBalance()
  }

  const refreshBalance = () => {
    setBalanceLoading(true)
    setBalanceMenuVisible(false)
    initBalance().then(r => {
      setBalance(r.data.balance)
    }).finally(() => {
      setBalanceLoading(false)
    })
  }

  useEffect(() => {
    refreshTransactions()
    refreshBalance()
  }, [])

  const initTransactions = async (limit) => {
    return await TransactionApi.getTransactions(limit)
  }

  const initBalance = async () => {
    return await WalletApi.getWallet()
  }

  const deleteAllTransactions = () => {
    TransactionApi.deleteAll().then(r => {
      if(r.status == 204) {
        refreshTransactions()
      }
    })
  }
  
  const deleteTransaction = (id) => {
    TransactionApi.delete(id).then(r => {
      if(r.status == 204) {
        seeAllTransactions()
        refreshTransactions()
      }
    })
  }
  
  const RenderTransactions = () => {
    if(Object.keys(transactions).length > 0) {
      return (
        transactions.map((transaction, i) => {
          return (
            <View key={i} style={{flexDirection:'row', alignItems:'center', marginTop:20}}>
              <Icon color={"#ccc"} name={transaction.type == 'income' ? 'plus-circle' : 'minus-circle'} type='font-awesome' size={15} style={{paddingRight:10, backgroundColor:'#fff', borderRadius:100}}/>
              <Text style={{fontSize:16, fontWeight:'400', color:'#666', fontWeight:'bold'}}>{transaction.type.toUpperCase()} </Text>
              <Text style={{fontSize:16, fontWeight:'400', color:'#666', fontWeight:'600'}}>{transaction.amount} {transaction.currency} </Text>
              <Text style={{fontSize:16, fontWeight:'400', color:'#666', fontStyle:'italic', fontWeight:'bold'}}>{transaction.transaction_date}</Text>
            </View>
          )
        })
      )
    }else {
      return (
        <View style={{marginTop:20, flexDirection:'row', alignItems:'center'}}>
          <View style={{width:40, height:40, backgroundColor:'#ccc', borderRadius:100, marginRight:10}}></View>
          <Text style={{fontSize:16, fontWeight:'400', color:'#666',}}>You dont have any transactions.</Text>
        </View>
      )
    }
  }

  const handleOpenTransactionActions = (id) => {
    Alert.alert("Actions", null, [
      {
        text: 'Delete',
        onPress: () => deleteTransaction(id)
      },
      {
        text: 'Cancel',
        style: 'destructive'
      }
    ])
  }
  
  const RenderAllTransactions = () => {
    if(Object.keys(allTransactions).length > 0) {
      return (
        allTransactions.map((transaction, i) => {
          return (
            <TouchableOpacity key={i} onLongPress={() => handleOpenTransactionActions(transaction.id)}>
              <View style={{flexDirection:'row', alignItems:'center', marginTop:20}}>
                <Icon color={"#ccc"} name={transaction.type == 'income' ? 'plus-circle' : 'minus-circle'} type='font-awesome' size={15} style={{paddingRight:10, backgroundColor:'#fff', borderRadius:100}}/>
                <Text style={{fontSize:16, fontWeight:'400', color:'#666', fontWeight:'bold'}}>{transaction.type.toUpperCase()} </Text>
                <Text style={{fontSize:16, fontWeight:'400', color:'#666', fontWeight:'600'}}>{transaction.amount} {transaction.currency} </Text>
                <Text style={{fontSize:16, fontWeight:'400', color:'#666', fontStyle:'italic', fontWeight:'bold'}}>{transaction.transaction_date}</Text>
              </View>
            </TouchableOpacity>
          )
        })
      )
    }else {
      return (
        <View style={{marginTop:20, flexDirection:'row', alignItems:'center'}}>
          <View style={{width:40, height:40, backgroundColor:'#ccc', borderRadius:100, marginRight:10}}></View>
          <Text style={{fontSize:16, fontWeight:'400', color:'#666',}}>You dont have any transactions.</Text>
        </View>
      )
    }
  }

  const seeAllTransactions = () => {
    transactionActionSheetRef.current?.show()
    setTransactionsLoading(true)
    setTransactionsMenuVisible(false)
    initTransactions().then(r => {
      setAllTransactions(r.data)
    }).finally(() => {
      setTransactionsLoading(false)
    })
  }

  return (
    <View style={styles.container}>
      <ActionSheet defaultOverlayOpacity={0.60} containerStyle={{height:'95%', paddingTop:20}} ref={actionSheetRef} animated={true} gestureEnabled={true}>
        { visible ? <Toast status={status} message={message}/> : null}
        <View style={{padding:30}}>
          <View>
            <Text style={{fontWeight:'bold', fontSize:20}}>{type == 'income' ? 'Income' : 'Expense'}</Text>
          </View>
          <View style={{marginTop:20}}>
            <TextInput onChangeText={amount => setAmount(amount)} placeholder='Amount' keyboardType='numeric' returnKeyType='done' style={{padding:15, backgroundColor:'#fafbfb', borderWidth:1, borderRadius:10, borderColor:'#ccc'}}></TextInput>
          </View>
          <DatePicker
            minuteInterval={1}
            onSelectedChange={selectedDate => setSelectedDate(selectedDate)}
            mode="calendar"
            style={{ borderRadius: 10, marginTop:20}}
          />
          <View style={{height:50, marginTop:20}}>
            <Button onPress={() => handleAction()} bgColor="#3201ff" textColor="#fff" text="Save" icon={
              <Icon name="save" size={15} color="#fff" type='ionicon'></Icon>
            } />
          </View>
        </View>
      </ActionSheet>
      <ActionSheet ref={transactionActionSheetRef} containerStyle={{height:'100%', paddingTop:20}} animated={true} gestureEnabled={false}>
        <View style={{padding:30}}>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'baseline'}}>
            <Text style={{fontWeight:'bold', fontSize:20}}>Transactions</Text>
            <TouchableOpacity onPress={() => transactionActionSheetRef.current?.hide()}>
              <Text style={{fontWeight:'500', fontSize:17, color:'#5CB8E4'}}>Hide</Text>
            </TouchableOpacity>
          </View>
          {
            transactionsLoading
            ?
            <ActivityIndicator animating={transactionsLoading}></ActivityIndicator>
            : 
            <ScrollView contentInset={{bottom:40}} style={{marginVertical:20, height:'100%'}} id='transactionsActionSheet' {...scrollHandlers}>
              <RenderAllTransactions/>
            </ScrollView>
          }
        </View>
      </ActionSheet>
      <Header navigation={navigation} right={true}/>
      <View style={styles.card}>
          <View style={{justifyContent:'space-between', alignItems:'center', flexDirection:'row'}}>
            <Text style={styles.cardPlaceHolderText}>Available Balance</Text>
            <Menu
              contentStyle={{backgroundColor:'#fff', padding:0, margin:0}}
              visible={balanceMenuVisible}
              onDismiss={() => {
                setBalanceMenuVisible(false)
              }}
              anchor={<TouchableOpacity onPress={() => {
                setBalanceMenuVisible(true)
              }}>
                <Icon name='dots-three-horizontal' type='entypo' color={"#A66CFF"}/>
              </TouchableOpacity>}>
              <Menu.Item onPress={() => refreshBalance()} title="Refresh" />
            </Menu>
          </View>
          {
            balanceLoading ? <ActivityIndicator animating={balanceLoading}></ActivityIndicator> : 
            <>
              <View style={{marginTop:10}}>
                <Text style={{fontSize:30, fontWeight:'600'}}>{balance} USD</Text>
              </View>
              <View style={styles.buttonContainer}>
                <Button onPress={() => {
                  handleOpenAddIncomeOrExpenseActionSheet('income')
                }} style={{marginRight:10}} bgColor="#3201ff" textColor="#fff" text="Income" icon={
                  <Icon name="plus-circle" size={15} color="#fff" type='font-awesome'></Icon>
                } />
                <Button onPress={() => {
                  handleOpenAddIncomeOrExpenseActionSheet('expense')
                }} bgColor="#dbcbff" textColor="#3201ff" text="Expense" icon={
                  <Icon name="minus-circle" size={15} color="#3201ff" type='font-awesome'></Icon>
                } />
              </View>
            </>
          }
      </View>
      <View style={[styles.card, {flex:1}]}>
        <View style={{justifyContent:'space-between', alignItems:'center', flexDirection:'row'}}>
          <Text style={styles.cardPlaceHolderText}>Transactions</Text>
          <Menu
              contentStyle={{backgroundColor:'#fff', padding:0, margin:0}}
              visible={transactionsMenuVisible}
              onDismiss={() => {
                setTransactionsMenuVisible(false)
              }}
              anchor={<TouchableOpacity onPress={() => {
                setTransactionsMenuVisible(true)
              }}>
                <Icon name='dots-three-horizontal' type='entypo' color={"#A66CFF"}/>
              </TouchableOpacity>}>
              <Menu.Item onPress={() => refreshTransactions()} title="Refresh" />
              { 
                Object.keys(transactions).length > 0 ? 
                <>
                <Menu.Item onPress={() => seeAllTransactions()} title="See All" />
                <Menu.Item onPress={() => deleteAllTransactions()} title="Delete All" /> 
                </>
                :
                null
              }
          </Menu>
        </View>
        {
        transactionsLoading 
        ?
        <ActivityIndicator animating={transactionsLoading}></ActivityIndicator>
        :
        <ScrollView>
          <RenderTransactions/>
        </ScrollView>
        }
      </View>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    marginTop:10,
    justifyContent:'space-arround'
  },
  container: {
    paddingHorizontal:20,
    paddingVertical:0,
    flex: 1,
    backgroundColor: "#f9fbfa", 
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    padding:20,
    shadowColor: "#666",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.00,
    elevation: 1,
  },
  cardPlaceHolderText: {
    color:"#999",
    fontWeight:'600'
  }
})