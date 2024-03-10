import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScoreboardScreen = () => {
    const { finalScore } = route.params;
    const [topScores, setTopScores] = useState([]);

    useEffect(() => {
        loadTopScores();
    }, []);

    const loadTopScores = async () => {
        try {
            const allKeys = await AsyncStorage.getAllKeys();
            console.log('All Keys:', allKeys);
            const scores = await AsyncStorage.multiGet(allKeys);
            console.log('Scores:', scores);
    
            const parsedScores = scores.map(([key, value]) => {
                if (key !== "topScores") {
                    return { player: key, points: JSON.parse(value) };
                } else {
                    return null;
                }
            }).filter(score => score); // Remove undefined values
            console.log('Parsed Scores:', parsedScores);
    
            setTopScores(parsedScores);
        } catch (error) {
            console.error('Error loading top scores:', error);
        }
    };
    
    console.log('Top Scores:', topScores);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Scoreboard</Text>
            <View>
                {topScores.map((score, index) => (
                    <Text key={index}>{`${score.player}: ${score.points}`}</Text>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default ScoreboardScreen;
