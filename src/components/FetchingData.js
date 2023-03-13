import { useEffect, useState } from "react";
import styles from '@component/styles/Home.module.css'
import shuffleArray from "../utils/helper"

export default function ShowQuestions() {

    const [data, setData] = useState(null);
    const [quesno, setQuesno] = useState(0);
    const [answersArr, setAnswersArr] = useState([]);
    const [message, setMessage] = useState("");
    const [able, setAble] = useState(false);
    const [styleButton, setStyleButton] = useState(styles.answerbutton);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getData() {
          let res = await fetch(`https://opentdb.com/api.php?amount=10`);
          let body = await res.json();
          setData(body.results);
        }
        
        getData();
      }, []);

    useEffect(() => {
        if (data) {
            setLoading(true);
            const newAnswersArr = [];
            newAnswersArr.push(data[quesno].correct_answer);
            const incorrectAnswers = data[quesno].incorrect_answers;
            for (let i = 0; i < incorrectAnswers.length; i++) {
                newAnswersArr.push(data[quesno].incorrect_answers[i]);
            }

            const shuffledArray = shuffleArray(newAnswersArr);
            setAnswersArr(shuffledArray);
        }

    }, [data, quesno]);
    
    

    function nextQuestion() {
        if (quesno < data.length - 1) {
            setQuesno(quesno + 1);
            setMessage("");
            setAble(false);
            setStyleButton(styles.answerbutton);
        }
    } 
    function checkAnswer(btn, i) {
        let correctIndex = answersArr.indexOf(data[quesno].correct_answer);
        if (correctIndex === i) {
            setMessage("Correct Answer!");
            setScore(score + 1);
            btn.classList.add(styles.correctanswer);
        } else {
            setMessage("WRONG!!!!");
            btn.classList.add(styles.incorrectanswer);
            
        }
        setAble(true);
    }

    return (
        <section className={styles.box}>
            <div className={styles.centering}>
                <object type="image/svg+xml" data="/loading.svg" hidden={loading} ></object>
            </div>
            {data && (
                    <>
                        <h3 className={styles.centering}>Marks: {score} /10</h3>
                        <p className={styles.category}>{data[quesno].category}</p>
                        <p className={styles.type}>Type: {data[quesno].type}</p>
                        <p className={styles.difficulty}>Difficulty: {data[quesno].difficulty}</p>
                        <p className={styles.question}>{data[quesno].question}</p>

                        {answersArr.map((answer, i) => (
                            <div className={styles.buttonarrangement} key={`answer-${i}`}>
                            <button className={styleButton} key={`button-${i}`} onClick={ (e) => checkAnswer(e.target, i)} disabled={able} >{answer}</button>
                            </div>
                        ))}
                    </>
                )}

            {message && (
                <h3 className={styles.centering}>{message}</h3>
            )}
            <div className={styles.nextquestion}>
                <button className={styles.nextbutton}  onClick={ () => nextQuestion()}>Next question</button>
            </div>
        </section>
    );
}