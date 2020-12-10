import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableWithoutFeedback, ImageBackground, Dimensions, Animated, Easing, Image, AppState, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import * as SplashScreen from 'expo-splash-screen';

// Radio Button Component
import RadioButton from './components/RadioButton';

// Expo-av module for background audio
import { Audio } from "expo-av";

// Typewriter effect
import TypeWriter from "react-native-typewriter";

// Custom Font - Oxygen
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

import { ViewStyleProp, TextStyleProp, } from 'react-native'

// Background PNG
import background from './assets/images/background.png';

// Character PNGs
import excitedCharacter from './assets/images/excited.png';
import happyCharacter from './assets/images/happy.png';
import neutralCharacter from './assets/images/neutral.png';
import sadCharacter from './assets/images/sad.png';

// Segmented Control Tab for multiple choice
import SegmentedControlTab from "react-native-segmented-control-tab";

Props = {
  tabStyle: ViewStyleProp,
  textNumberOfLines: 4,
}
// Used to make the left icon and CSS attributes such as fontSize relative to the screen size
const { width, height } = Dimensions.get("window");
const screenWidth = width;
const screenHeight = height;
var iconSize = screenWidth / 10;
var total = 0;
var IDs = [];
var text;

const phq9Values = ["Not at all", "Several\ndays", "More than half the\ndays", "Nearly everyday"]

const genderOptions = [
  {
    key: 'male',
    text: 'Male',
  },
  {
    key: 'female',
    text: 'Female',
  },
  {
    key: 'transgender',
    text: 'Transgender',
  },
  {
    key: 'genderqueerNonBinary',
    text: 'Genderqueer/Non-Binary',
  },
  {
    key: 'other',
    text: 'Other',
  },
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentId: 1,
      assetsLoaded: false,
      typewriterEffect: true,
      startWriting: false,
      bubbleTransform: new Animated.Value(0),
      characterTransform: new Animated.Value(0),
      appState: 'active',
      gender: 'Other',
      firstName: '',
      selectedIndex: 0,
    };


    AppState.addEventListener('change', newState => this.setState({ appState: newState }));


    // The second item in the list controls which character will show up
    this.textBoxes = {
      1: ["Hello, welcome to Project Beck!", "happy", "text"],
      2: ["I’m so excited to meet you.", "excited", "text"],
      3: ["Please enter your first name?", "neutral", "textInput"],
      4: ["What's your gender?", "neutral", "radioInput"],
      5: ["Over the last 2 weeks, how often did you have little interest/pleasure in doing things?",
        "", "segmentedControlTab"],
      6: ["Over the last 2 weeks, how often were you feeling down, depressed, or hopeless?",
        "", "segmentedControlTab"],
      7: ["Over the last 2 weeks, how often did you have trouble falling or staying asleep, or sleeping too much?",
        "", "segmentedControlTab"],
      8: ["Over the last 2 weeks, how often were you feeling tired or had little energy?",
        "", "segmentedControlTab"],
      9: ["Over the last 2 weeks, how often did you have a problem with poor appetite or overeating?",
        "", "segmentedControlTab"],
      10: ["Over the last 2 weeks, how often were you feeling bad about yourself — or that you are a failure or have let yourself or your family down?",
        "", "segmentedControlTab"],
      11: ["Over the last 2 weeks, how often did you have trouble concentrating on things, such as reading the newspaper or watching television?",
        "", "segmentedControlTab"],
      12: ["Over the last 2 weeks, how often were you moving or speaking so slowly that other people could have noticed? Or so fidgety or restless that you have been moving a lot more than usual?",
        "", "segmentedControlTab"],
      13: ["Over the last 2 weeks, how often did you have thoughts that you would be better off dead, or thoughts of hurting yourself in some way?",
        "", "segmentedControlTab"],
      14: ["", "", "text"],
    }
  };

  async componentDidMount() {
    // Creates an instance of Audio.sound
    const soundObject = new Audio.Sound();
    // Loads sound
    await soundObject.loadAsync(require("./assets/soundtracks/welcome.mp3"));
    // Makes the soundtrack loop
    soundObject.setIsLoopingAsync(true);
    // Sets the volume of the soundtrack (must be between 0 and 1)
    soundObject.setVolumeAsync(0.45);
    // Plays sound
    await soundObject.playAsync();

    try {
      await SplashScreen.preventAutoHideAsync();
    } catch (e) {
      console.warn(e);
    }
    await Font.loadAsync({
      'oxygen-bold': require('./assets/fonts/Oxygen-Bold.ttf'),
      'oxygen-regular': require('./assets/fonts/Oxygen-Regular.ttf'),
      'oxygen-light': require('./assets/fonts/Oxygen-Light.ttf')
    });

    // Start the text bubble animation
    this.startTextAnimation();

    this.setState({ assetsLoaded: true });
    await SplashScreen.hideAsync();
  }

  handleIndexChange = index => {

    this.setState({ selectedIndex: index });
    if (this.state.currentId != 14) {
      IDs.push(this.state.currentId + '' + index);
      var id5 = IDs.filter((id) => id.charAt(0) === '5');
      var id6 = IDs.filter((id) => id.charAt(0) === '6');
      var id7 = IDs.filter((id) => id.charAt(0) === '7');
      var id8 = IDs.filter((id) => id.charAt(0) === '8');
      var id9 = IDs.filter((id) => id.charAt(0) === '9');
      var id10 = IDs.filter((id) => id.slice(0, 2) === '10');
      var id11 = IDs.filter((id) => id.slice(0, 2) === '11');
      var id12 = IDs.filter((id) => id.slice(0, 2) === '12');
      var id13 = IDs.filter((id) => id.slice(0, 2) === '13');
      if (this.state.currentId === 13) {
        var ids = [id5, id6, id7, id8, id9, id10, id11, id12, id13]
        var value;
        for (var i = 0; i < ids.length; i++) {
          value = (ids[i]).pop();
          value = value.charAt(value.length - 1)
          total += parseInt(value)
        }
      }
      switch (true) {
        case (total <= 4):
          text = "Scores ≤4 suggest minimal depression which may not require treatment."
          break;
        case (total >= 5 && total <= 9):
          text = 'Scores 5-9 suggest mild depression which may require only watchful waiting and repeated PHQ-9 at followup.'
          break;
        case (total >= 10 && total <= 14):
          text = 'Scores 10-14 suggest moderate depression severity; patients should have a treatment plan ranging form counseling, followup, and/or pharmacotherapy.'
          break;
        case (total >= 15 && total <= 19):
          text = 'Scores 15-19 suggest moderately severe depression; patients typically should have immediate initiation of pharmacotherapy and/or psychotherapy.'
          break;
        case (total >= 20):
          text = 'Scores 20 and greater suggest severe depression; patients typically should have immediate initiation of pharmacotherapy and expedited referral to mental health specialist.'
          break;
        default:
          text = ''
          break;
      }
      this.textBoxes[14][0] = text;
    }
  };

  // Starts the text bubble animation and then calls the character animation
  startTextAnimation = () => {
    Animated.timing(this.state.bubbleTransform, {
      toValue: 1,
      duration: 800,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start(() => { this.startCharacterAnimation() });
  };

  // Starts the character animation and then changes the startWriting state variable so text can start to show up
  startCharacterAnimation = () => {
    Animated.timing(this.state.characterTransform, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.linear),
      useNativeDriver: true,
    }).start(() => { this.setState({ startWriting: true }) });
  }

  // Changes the text and image to that of the following "page" in the intro sequence
  goToNext = () => {
    this.state.selectedIndex = null;
    if (this.state.typewriterEffect == true) {
      this.setState({ typewriterEffect: false });
    }
    else if (this.state.currentId != Object.keys(this.textBoxes).length) {
      this.setState({ currentId: this.state.currentId + 1 });
      this.setState({ typewriterEffect: true });
    }
  };

  // Changes the text and image to that of the preceding "page" in the intro sequence
  goBack = () => {
    if (this.state.currentId != 1) {
      this.setState({ typewriterEffect: false });
      this.setState({ currentId: this.state.currentId - 1 });
    }
  };

  // Updates the gender of the user when one of the radio buttons is selected
  onGenderInput = (val) => {
    this.setState({
      gender: val
    })
  };

  render() {
    const { selectedIndex, textNumberOfLines } = this.state
    var emotion = this.textBoxes[this.state.currentId][1];
    var character;
    if (emotion == "excited") {
      character = excitedCharacter;
    }
    else if (emotion == "happy") {
      character = happyCharacter;
    }
    else if (emotion == "neutral") {
      character = neutralCharacter;
    }
    else if (emotion == "sad") {
      character = sadCharacter;
    }

    // Animations
    const textAnimationStyle = {
      transform: [{ scale: this.state.bubbleTransform }]
    }

    const yVal = this.state.characterTransform.interpolate({
      inputRange: [0, 1],
      outputRange: [450, 0]
    })

    const characterAnimationStyle = {
      transform: [{
        translateY: yVal
      }]
    }

    // Controls whether the text is shown as a typewriter or not
    var textType = [];
    if (this.state.startWriting == false) {
      textType.push();
    }
    else if (this.state.typewriterEffect) {
      if (this.textBoxes[this.state.currentId][0].length > 170) {
        textType.push(
          <TypeWriter key="typewriter" style={componentStyles.mediumText} typing={1} fixed={false} onTypingEnd={this.goToNext} maxDelay={35} fixed={true}>
            {this.textBoxes[this.state.currentId][0]}
          </TypeWriter>
        );
      } else {
        textType.push(
          <TypeWriter key="typewriter" style={componentStyles.text} typing={1} fixed={false} onTypingEnd={this.goToNext} maxDelay={35} fixed={true}>
            {this.textBoxes[this.state.currentId][0]}
          </TypeWriter>
        );
      }
    }
    else {
      if (this.textBoxes[this.state.currentId][0].length > 170) {
        textType.push(
          <Text key="text" style={componentStyles.mediumText}>
            {this.textBoxes[this.state.currentId][0]}
          </Text>
        );
      } else {
        textType.push(
          <Text key="text" style={componentStyles.text}>
            {this.textBoxes[this.state.currentId][0]}
          </Text>
        );
      }
    }


    // Controls whether an input question shows up
    var inputQuestion = [];
    if (this.textBoxes[this.state.currentId][2] == "radioInput") {
      inputQuestion =
        <View style={containerStyles.genderOptionsView}>
          <RadioButton options={genderOptions} onUpdate={this.onGenderInput} />
        </View>
    }
    else if (this.textBoxes[this.state.currentId][2] == "textInput") {
      inputQuestion =
        <View style={containerStyles.genderOptionsView}>
          <TextInput
            style={componentStyles.textInput}
            onChangeText={text => this.setState({ 'firstName': text })}
            value={this.state.firstName}
          ></TextInput>
        </View>
    } else if (this.textBoxes[this.state.currentId][2] == "segmentedControlTab") {
      inputQuestion =
        <View style={containerStyles.Seperator} >
          <SegmentedControlTab textNumberOfLines={4}
            values={phq9Values}
            selectedIndex={this.state.selectedIndex}
            onTabPress={this.handleIndexChange}
            borderRadius={10}
            tabsContainerStyle={segmentedControlTabStyles.tabsContainerStyle}
            tabStyle={segmentedControlTabStyles.tabStyle}
            activeTabStyle={segmentedControlTabStyles.activeTabStyle}
            tabTextStyle={segmentedControlTabStyles.tabTextStyle}
            activeTabTextStyle={segmentedControlTabStyles.activeTabTextStyle}
          />
        </View>
    }

    // Waits to load the page until the custom font is loaded
    const { assetsLoaded } = this.state;
    if (!assetsLoaded) {
      return (
        <AppLoading
          startAsync={this.fetchFonts}
          onFinish={() => setDataLoaded(true)}
        />
      );
    }
    else {
      return (

        <TouchableWithoutFeedback onPress={this.goToNext}>

          <View style={containerStyles.container}>

            <ImageBackground source={background} style={containerStyles.standardBackground}>

              <Animated.View style={[componentStyles.textBubbleAnimation, textAnimationStyle]}>
                <View style={componentStyles.textBubble}>
                  <View style={componentStyles.iconView} onPress={this.goBack}>
                    <Icon name="angle-left" size={iconSize} color="#095266" style={componentStyles.leftIcon} onPress={this.goBack} />
                  </View>

                  <View style={componentStyles.textView}>
                    {textType}
                    {inputQuestion}
                  </View>
                </View>
              </Animated.View>

              <Animated.View style={[containerStyles.characterViewAnimation, characterAnimationStyle]}>
                <View style={containerStyles.characterView}>
                  <Image source={character} fadeDuration={0} />
                </View>
              </Animated.View>

            </ImageBackground>

          </View>
        </TouchableWithoutFeedback>
      );
    };
  }
}

const containerStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  standardBackground: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterView: {
    height: '100%',
    width: '100%',
  },
  characterViewAnimation: {
    zIndex: 4,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  character: {
    zIndex: 3,
  },
  genderOptionsView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '10%',
    width: '100%'
  },
});

const componentStyles = StyleSheet.create({
  textBubbleAnimation: {
    zIndex: 2,
    width: '92%',
    height: '62%',
    bottom: '6%',
  },
  textBubble: {
    zIndex: 2,
    height: '105%',
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    borderRadius: screenWidth * .1,
    shadowOffset: { width: screenWidth * .024, height: screenWidth * .024 },
    shadowRadius: 0,
    shadowColor: '#000000',
    shadowOpacity: .1,
  },
  textView: {
    height: '90%',
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '30%',
    paddingLeft: '12%',
    paddingRight: '12%',
  },
  text: {
    fontFamily: 'oxygen-light',
    fontSize: screenWidth * .072,
    flexWrap: 'wrap',
    // lineHeight: screenWidth * .108,
    textAlign: 'left',
    color: '#195D70',
    paddingBottom: 0,
    marginBottom: 0,
  },
  smallText: {
    fontFamily: 'oxygen-light',
    fontSize: screenWidth * .057,
    flexWrap: 'wrap',
    // lineHeight: screenWidth * .108,
    textAlign: 'left',
    color: '#195D70',
    paddingBottom: 10,
    marginBottom: 0,
  },
  mediumText: {
    fontFamily: 'oxygen-light',
    fontSize: screenWidth * .060,
    flexWrap: 'wrap',
    // lineHeight: screenWidth * .108,
    textAlign: 'left',
    color: '#195D70',
    paddingBottom: 10,
    marginBottom: 0,
  },
  iconView: {
    justifyContent: 'space-around',
    height: '20%'
  },
  leftIcon: {
    height: '100%',
    paddingTop: '8%',
    paddingLeft: '8%',
  },
  textInput: {
    width: '85%',
    height: 49,
    color: '#333333',
    backgroundColor: '#EFF2F6',
    borderWidth: 1,
    borderRadius: screenWidth * .03,
    fontFamily: 'oxygen-light',
    fontSize: screenWidth * .05,
    padding: 12
  }
});

const segmentedControlTabStyles = StyleSheet.create({
  tabsContainerStyle: {
    height: 80,
    backgroundColor: '#F2F2F2',
    width: 300,
    borderRadius: 10,
    marginTop: '12%'
  },
  tabStyle: {
    backgroundColor: '#F2F2F2',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  activeTabStyle: {
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: screenWidth * .001
    },
    shadowRadius: 2,
    shadowOpacity: .6
  },
  tabTextStyle: {
    color: '#BBBBBB',
    flexWrap: "wrap",
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
    fontFamily: 'oxygen-regular',

  },
  activeTabTextStyle: {
    color: '#195D70',
    textAlign: "center",
    flexWrap: "wrap",
    fontFamily: 'oxygen-regular',
    opacity: 1
  },
});

export default App;