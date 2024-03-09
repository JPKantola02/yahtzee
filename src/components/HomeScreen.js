import React, { useState } from 'react';
import { View, Text, TextInput, Button, Keyboard } from 'react-native';

// Constants for game settings
const NBR_OF_DICES = 5;
const NBR_OF_THROWS = 3;
const MIN_SPOT = 1;
const MAX_SPOT = 6;
const BONUS_POINTS_LIMIT = 63;
const BONUS_POINTS = 35;

const HomeScreen = ({ navigation }) => {
    const [playerName, setPlayerName] = useState('');
    const [showRules, setShowRules] = useState(false);

    const handleStartGame = () => {
        if (playerName.trim() !== '') {
            setShowRules(true);
            Keyboard.dismiss();
        }
    };

    const handlePlayGame = () => {
        navigation.navigate('Gameboard', { playerName });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {!showRules ? (
                <>
                    <Text>Enter Your Name</Text>
                    <TextInput
                        style={{ borderWidth: 1, borderColor: 'gray', padding: 5, marginTop: 10 }}
                        placeholder="Your Name"
                        onChangeText={text => setPlayerName(text)}
                        value={playerName}
                        autoCapitalize="words"
                        autoFocus={true}
                    />
                    <Button title="OK" onPress={handleStartGame} disabled={!playerName.trim()} />
                </>
            ) : (
                <>
                    <Text>{`Rules of the game\n\nTHE GAME: Upper section of the classic Yahtzee
dice game. You have ${NBR_OF_DICES} dices and
for the every dice you have ${NBR_OF_THROWS}
throws. After each throw you can keep dices in
order to get same dice spot counts as many as
possible. In the end of the turn you must select
your points from ${MIN_SPOT} to ${MAX_SPOT}.
Game ends when all points have been selected.
The order for selecting those is free.
\nPOINTS: After each turn game calculates the sum
for the dices you selected. Only the dices having
the same spot count are calculated. Inside the
game you can not select same points from
${MIN_SPOT} to ${MAX_SPOT} again.
\nGOAL: To get points as much as possible.
${BONUS_POINTS_LIMIT} points is the limit of
getting bonus which gives you ${BONUS_POINTS}
points more.`}</Text>
                    <Button title="Play" onPress={handlePlayGame} />
                </>
            )}
        </View>
    );
};

export default HomeScreen;
