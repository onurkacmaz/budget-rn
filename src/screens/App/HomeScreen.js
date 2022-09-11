import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { Icon } from "@rneui/themed";
import Button from '../../components/Button';
import ActionSheet from "react-native-actions-sheet";
import DatePicker from 'react-native-modern-datepicker';
import Toast from '../../components/Toast';
import { Menu } from 'react-native-paper';
import axios from 'axios';
import { useEffect } from 'react';
import Profile from '../../components/Profile';
import UIAvatar from '../../components/UIAvatar';

const HomeScreen = ({route, navigation}) => {
  const actionSheetRef = useRef(null);
  const profileActionSheetRef = useRef(null)
  const [type, setType] = useState(null)
  const [selectedDate, setSelectedDate] = useState('');
  const [amount, setAmount] = useState(0);
  const [transactions, setTransactions] = useState([])
  const [status, setStatus] = useState("asdasda")
  const [message, setMessage] = useState("sd")
  const [visible, setVisible] = useState(false)
  const [balanceMenuVisible, setBalanceMenuVisible] = useState(false)
  const [transactionsMenuVisible, setTransactionsMenuVisible] = useState(false)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [balance, setBalance] = useState(0)

  const handleOpenAddIncomeOrExpenseActionSheet = (type) => {
    setType(type);
    actionSheetRef.current?.show();
  }

  const handleGoProfile = () => {
    profileActionSheetRef.current?.show()
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
    setTransactions(transactions.concat([
      {
        type: 'income',
        amount: amount,
        createdAt: selectedDate
      }
    ]))
  }

  const addExpense = () => { 
    setTransactions(transactions.concat([
      {
        type: 'expense',
        amount: amount,
        createdAt: selectedDate
      }
    ]))
  }
  
  function compare(a, b) {
    if ( a.createdAt > b.createdAt ){
      return -1;
    }
    if ( a.createdAt < b.createdAt ){
      return 1;
    }
    return 0;
  }

  const refreshTransactions = () => {
    setTransactionsLoading(true)
    setTransactionsMenuVisible(false)
    initTransactions().then(r => {
      setTransactions(r.data)
    }).finally(() => {
      setTransactionsLoading(false)
    })
  }

  const refreshBalance = () => {
    setBalanceLoading(true)
    setBalanceMenuVisible(false)
    initBalance().then(r => {
      var balance = 0;
      r.data.map((v,i) => {
        balance += v.amount.number
      })
      setBalance(balance)
    }).finally(() => {
      setBalanceLoading(false)
    })
  }

  useEffect(() => {
    refreshTransactions()
    refreshBalance()
  }, [])

  const initTransactions = async () => {
    return await axios.get('https://getapimaker.com/api/?access_token=a285fec04ce9eabc9362e2b55ae0df6a');
  }

  const initBalance = async () => {
    return await axios.get('https://getapimaker.com/api/?access_token=a285fec04ce9eabc9362e2b55ae0df6a');
  }
  
  const getTransactions = () => {
    if(Object.keys(transactions).length > 0) {
      return (
        transactions.sort(compare).map((transaction, i) => {
          return (
            <View key={i} style={{flexDirection:'row', alignItems:'center', marginTop:20}}>
              <Icon color={"#ccc"} name={transaction.type.select.name == 'income' ? 'plus-circle' : 'minus-circle'} type='font-awesome' size={15} style={{paddingRight:10, backgroundColor:'#fff', borderRadius:100}}/>
              <Text style={{fontSize:16, fontWeight:'400', color:'#666', fontWeight:'bold'}}>{transaction.type.select.name.toUpperCase()} </Text>
              <Text style={{fontSize:16, fontWeight:'400', color:'#666', fontWeight:'600'}}>{transaction.amount.number} {transaction.currency.select.name} </Text>
              <Text style={{fontSize:16, fontWeight:'400', color:'#666', fontStyle:'italic', fontWeight:'bold'}}>{new Date(transaction.createdAt.created_time).toLocaleString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
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

  const seeAllTransactions = () => { 
    setTransactionsMenuVisible(false)
    navigation.navigate("Transactions")
  }

  return (
    <View style={styles.container}>
      <ActionSheet defaultOverlayOpacity={0.60} containerStyle={{height:'95%', paddingTop:20}} ref={profileActionSheetRef} animated={true} gestureEnabled={true}>
        <Profile navigation={navigation} actionSheet={profileActionSheetRef}/>
      </ActionSheet>
      <ActionSheet springOffset={12} defaultOverlayOpacity={0.60} containerStyle={{height:'95%', paddingTop:20}}ref={actionSheetRef} animated={true} gestureEnabled={true}>
        { visible ? <Toast status={status} message={message}/> : null}
        <View style={{padding:30}}>
          <View>
            <Text style={{fontWeight:'bold', fontSize:20}}>{type == 'income' ? 'Income' : 'Expense'}</Text>
          </View>
          <View style={{marginTop:20}}>
            <TextInput onChangeText={amount => setAmount(amount)} placeholder='Amount' keyboardType='number-pad' returnKeyType='done' style={{padding:15, backgroundColor:'#fafbfb', borderWidth:1, borderRadius:10, borderColor:'#ccc'}}></TextInput>
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
      <View style={styles.header}>
        <View>
          <TouchableOpacity onPress={() => handleGoProfile()}>
            <UIAvatar/>
          </TouchableOpacity>
        </View>
        <View style={{justifyContent:'flex-end', flexDirection:'row', flex:1}}>
          <TouchableOpacity>
            <Icon
              padding={10}
              type='ionicon'
              name='notifications-outline'
              size={23}
              color='#3201ff'
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              padding={10}
              type='ionicon'
              name='information-circle-outline'
              size={25}
              color='#3201ff'
            />
          </TouchableOpacity>
        </View>
      </View>
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
      <View style={styles.card}>
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
              <Menu.Item onPress={() => seeAllTransactions()} title="See All" />
          </Menu>
        </View>
        {
          transactionsLoading ? <ActivityIndicator animating={transactionsLoading}></ActivityIndicator> : 
          <>
            { getTransactions() }
          </>
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
  header: {
    marginBottom:10,
    flexDirection: 'row',
    alignItems:'center'
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