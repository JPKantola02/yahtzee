import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants
const NBR_OF_DICES = 5;
const NBR_OF_THROWS = 3;
const MIN_SPOT = 1;
const MAX_SPOT = 6;
const BONUS_POINTS_LIMIT = 40;
const BONUS_POINTS = 50;

const GameboardScreen = ({ navigation }) => {
    const [rollsLeft, setRollsLeft] = useState(3);
    const [selectedDice, setSelectedDice] = useState(Array.from({ length: 5 }, () => false));
    const [totalScore, setTotalScore] = useState(0);
    const [diceValues, setDiceValues] = useState(Array.from({ length: 5 }, () => 1));
    const [showDice, setShowDice] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [lockedCategories, setLockedCategories] = useState([]);
    const [gameEnded, setGameEnded] = useState(false);
    const [turnEnded, setTurnEnded] = useState(false);
    const [bonusPoints, setBonusPoints] = useState(0);
    const [pointsAwayFromBonus, setPointsAwayFromBonus] = useState(40);

    useEffect(() => {
        if (selectedCategories.length === 6) {
            endGame();
        }
    }, [selectedCategories]);

    useEffect(() => {
        if (totalScore >= BONUS_POINTS_LIMIT && bonusPoints === 0) {
            setBonusPoints(BONUS_POINTS);
        }
    }, [totalScore, bonusPoints]);

    useEffect(() => {
        setPointsAwayFromBonus(Math.max(BONUS_POINTS_LIMIT - totalScore, 0));
    }, [totalScore]);

    const calculateCountScore = (diceValues, number) => {
        return diceValues.reduce((score, value) => {
            if (value === number) {
                return score + number;
            }
            return score;
        }, 
    0);
};



    const calculateOnesScore = (diceValues) => calculateCountScore(diceValues, 1);
    const calculateTwosScore = (diceValues) => calculateCountScore(diceValues, 2);
    const calculateThreesScore = (diceValues) => calculateCountScore(diceValues, 3);
    const calculateFoursScore = (diceValues) => calculateCountScore(diceValues, 4);
    const calculateFivesScore = (diceValues) => calculateCountScore(diceValues, 5);
    const calculateSixesScore = (diceValues) => calculateCountScore(diceValues, 6);

    const scoringCategories = {
        Ones: { name: 'Ones', calculateScore: calculateOnesScore },
        Twos: { name: 'Twos', calculateScore: calculateTwosScore },
        Threes: { name: 'Threes', calculateScore: calculateThreesScore },
        Fours: { name: 'Fours', calculateScore: calculateFoursScore },
        Fives: { name: 'Fives', calculateScore: calculateFivesScore },
        Sixes: { name: 'Sixes', calculateScore: calculateSixesScore },
    };

    const calculateCategoryScore = (category, diceValues) => {
        const scoreFunction = scoringCategories[category].calculateScore;
        return scoreFunction(diceValues);
    };

    const handleCategorySelect = (category) => {
    if (turnEnded || gameEnded) {
        console.log('Turn has ended or game has ended. Categories cannot be selected.');
        return;
    }

    if (selectedCategories.includes(category)) {
        setSelectedCategories(selectedCategories.filter(item => item !== category)); // Deselect the category if it's already selected
    } else {
        setSelectedCategories([...selectedCategories, category]); // Select the category
        const categoryScore = calculateCategoryScore(category, diceValues);
        setTotalScore(totalScore + categoryScore);
        setLockedCategories([...lockedCategories, category]); // Update lockedCategories to indicate the category has been used
    }
};
    

    /* const calculateBonusPoints = () => {
        if (totalScore >= 40) {
            setBonusPoints(50);
        } else {
            setBonusPoints(40 - totalScore);
        }
    };*/
    
    // Update bonus points whenever total score changes
    

    const calculateTotalScore = (categories) => {
        let total = 0;
        categories.forEach((category) => {
            total += calculateCategoryScore(category, diceValues);
        });
        setTotalScore(total);
    };

    

    const rollDice = () => {
        if (rollsLeft > 0) {
            const newDiceValues = diceValues.map((value, index) => {
                return selectedDice[index] ? value : Math.floor(Math.random() * 6) + 1;
            });
            setDiceValues(newDiceValues);
            setShowDice(true);
            setRollsLeft(rollsLeft - 1);
        }   else {
            setTurnEnded(true); // All throws have been used, end the turn
        }
    };

    const getDiceImage = (value) => {
        return value === 1 ? 
            require('../assets/dice1.png') :
            value === 2 ? 
            require('../assets/dice2.png') :
            value === 3 ? 
            require('../assets/dice3.png') :
            value === 4 ? 
            require('../assets/dice4.png') :
            value === 5 ? 
            require('../assets/dice5.png') :
            value === 6 ? 
            require('../assets/dice6.png') : 
            null;
    };

    const toggleSelectDice = (index) => {
        if (!gameEnded) {
            const newSelectedDice = [...selectedDice];
            newSelectedDice[index] = !newSelectedDice[index];
            setSelectedDice(newSelectedDice);
        }
            
    };

    const endTurn = () => {
        // Add bonus points to total score
        const newTotalScore = totalScore + bonusPoints;
        setTotalScore(newTotalScore);
    
        setRollsLeft(3);
        setSelectedDice(Array.from({ length: 5 }, () => false));
        setSelectedCategories([]);
        setTurnEnded(false);
    };

    const endGame = async () => {
        // Add bonus points to total score
        const newTotalScore = totalScore + bonusPoints;
        setTotalScore(newTotalScore);

        setGameEnded(true);
        // Save final score
        try {
            await AsyncStorage.setItem('finalScore', newTotalScore.toString());

            navigation.navigate('Scoreboard');
        } catch (error) {
            console.error('Error saving final score:', error);
        }
        // Navigate to scoreboard or any other screen
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {showDice ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                            {diceValues.map((dice, index) => (
                                <TouchableOpacity key={index} onPress={() => toggleSelectDice(index)}>
                                    <Image source={getDiceImage(dice)} style={[styles.diceImage, selectedDice[index] && styles.selectedDice]} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        <Image source={require('../assets/yahtzeegameicon.png')} style={{ width: 200, height: 200, marginBottom: 20 }} />
                    )}
                    <Text>Throws left: {rollsLeft}</Text>
                    <TouchableOpacity style={styles.buttonContainer} onPress={rollDice} disabled={rollsLeft === 0}>
                        <Text style={styles.buttonText}>Throw Dice</Text>
                    </TouchableOpacity>
                    <Button title="End Turn" onPress={endTurn} disabled={!selectedDice.some((selected) => selected)} />
                    <Text>Total Score: {totalScore}</Text>
                    <Text>Points away from bonus: {pointsAwayFromBonus}</Text>
                </View>
                <View style={{ flex: 2, paddingHorizontal: 20 }}>
                    <Grid>
                        <Row>
                            <Col>
                                <View style={styles.pointButtonsContainer}>
                                {Object.keys(scoringCategories).map((categoryName, index) => (
                                    <View key={categoryName} style={styles.pointButtonContainer}>
                                        <TouchableOpacity
                                            style={[
                                                styles.pointButton,
                                                    { backgroundColor: lockedCategories.includes(categoryName) ? 'yellow' : 'white' },
                                                 ]}
                                                onPress={() => handleCategorySelect(categoryName)}
                                                disabled={lockedCategories.includes(categoryName)}
                                            >
                                                <Text style={[styles.circleText, lockedCategories.includes(categoryName) && styles.lockedCircleText]}>{categoryName}</Text>
                                                <Text style={styles.countText}>{calculateCategoryScore(categoryName, diceValues)}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            </Col>
                        </Row>
                    </Grid>
                </View>
            </ScrollView>
            <View style={styles.bottomTabContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <MaterialIcons name="home" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Scoreboard')}>
                    <MaterialIcons name="leaderboard" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: 'lightblue',
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText: {
        textAlign: 'center',
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
    },
    pointButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 20,
    },
    pointButtonContainer: {
        alignItems: 'center',
    },
    pointButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'black',
    },
    pointText: {
        fontSize: 16,
        marginTop: 5,
    },
    circleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    selectedCircleText: {
        color: 'white',
    },
    bottomTabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: 'gray',
        backgroundColor: 'lightgray',
    },
    diceImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    selectedDice: {
        borderWidth: 2,
        borderColor: 'yellow',
    },
    countText: {
        fontSize: 16,
        marginTop: 5,
        color: 'black',
    },

});

export default GameboardScreen;
