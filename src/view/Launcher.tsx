import { Button, Card, CardBody, CardHeader, Divider, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import { FaPaintBrush } from "react-icons/fa";
import { useModelStore } from '../model/Model';
import { useStudyStore } from "../study/StudyModel";

export default function Launcher() {
  const [pid, setPid] = useState(-1);
  const resetModel = useModelStore((state) => state.reset);
  const resetStudyModel = useStudyStore((state) => state.reset);

  function startExample(text: string) {
    resetModel();
    resetStudyModel();
    useModelStore.setState({
        layers: [
            {
                id: "1", layer: {
                    name: "Layer 1", color: "white", isVisible: true, modifications: {},
                    state: [{
                        //@ts-ignore
                        type: "paragraph",
                        children: [{
                            text: text
                        }],
                    }]
                }
            }
        ]
    })

    useModelStore.getState().refreshTextFields();

    window.location.hash = '/free-form';
}

  return <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
    <Card>
        <CardHeader><span style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5, fontWeight: 600}}><FaPaintBrush /> Textoshop</span></CardHeader>
        <Divider />
        <CardBody>
            <p>Это Textoshop - умный текстовый редактор с взаимодействиями, вдохновленными графическими редакторами. Выберите пример, чтобы начать.</p>
        </CardBody>
        <Divider />
        <CardBody>
            <span style={{fontWeight: 800}}>Примеры для изучения Textoshop</span>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 40, marginTop: 10}}>
                <Button 
                    onClick={() => {
                        startExample(`Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, "and what is the use of a book," thought Alice "without pictures or conversations?"

So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.

There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, "Oh dear! Oh dear! I shall be late!" (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.

In another moment down went Alice after it, never once considering how in the world she was to get out again.

The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.

Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled "ORANGE MARMALADE", but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody underneath, so managed to put it into one of the cupboards as she fell past it.`)
                    }}
                >Alice in Wonderland</Button>
                
                <Button
                    onClick={() => {
                        startExample(`Artificial intelligence (AI), in its broadest sense, is intelligence exhibited by machines, particularly computer systems. It is a field of research in computer science that develops and studies methods and software that enable machines to perceive their environment and use learning and intelligence to take actions that maximize their chances of achieving defined goals. Such machines may be called AIs.

Some high-profile applications of AI include advanced web search engines (e.g., Google Search); recommendation systems (used by YouTube, Amazon, and Netflix); interacting via human speech (e.g., Google Assistant, Siri, and Alexa); autonomous vehicles (e.g., Waymo); generative and creative tools (e.g., ChatGPT, Apple Intelligence, and AI art); and superhuman play and analysis in strategy games (e.g., chess and Go). However, many AI applications are not perceived as AI: "A lot of cutting edge AI has filtered into general applications, often without being called AI because once something becomes useful enough and common enough it's not labeled AI anymore." 

Alan Turing was the first person to conduct substantial research in the field that he called "machine intelligence". Artificial intelligence was founded as an academic discipline in 1956, by those now considered the founding fathers of AI: John McCarthy, Marvin Minksy, Nathaniel Rochester, and Claude Shannon. The field went through multiple cycles of optimism, followed by periods of disappointment and loss of funding, known as AI winter. Funding and interest vastly increased after 2012 when deep learning surpassed all previous AI techniques, and after 2017 with the transformer architecture. This led to the AI boom of the early 2020s, with companies, universities, and laboratories overwhelmingly based in the United States pioneering significant advances in artificial intelligence. 

The growing use of artificial intelligence in the 21st century is influencing a societal and economic shift towards increased automation, data-driven decision-making, and the integration of AI systems into various economic sectors and areas of life, impacting job markets, healthcare, government, industry, education, propaganda, and disinformation. This raises questions about the long-term effects, ethical implications, and risks of AI, prompting discussions about regulatory policies to ensure the safety and benefits of the technology.

The various subfields of AI research are centered around particular goals and the use of particular tools. The traditional goals of AI research include reasoning, knowledge representation, planning, learning, natural language processing, perception, and support for robotics. General intelligence—the ability to complete any task performable by a human on an at least equal level—is among the field's long-term goals. 

To reach these goals, AI researchers have adapted and integrated a wide range of techniques, including search and mathematical optimization, formal logic, artificial neural networks, and methods based on statistics, operations research, and economics. AI also draws upon psychology, linguistics, philosophy, neuroscience, and other fields.`)
                    }}
                >Wikipedia "Artificial Intelligence"</Button>

                <Button
                    onClick={() => {
                        startExample("");
                    }}
                >Пустая страница</Button>
            </div>
        </CardBody>
        <Divider />
        <CardBody>
            <span style={{fontWeight: 800}}>Запустить исследование</span>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'left', alignItems: 'center', gap: 40, marginTop: 10}}>
                <Select 
                variant="faded" label="ID участника" className="max-w-xs" 
                onChange={(e) => setPid(parseInt(e.target.value))}>
                    {
                        Array.from({length: 12}, (_, i) => i).map((i) => <SelectItem key={i} value={i+1} textValue={"P" + (i+1)}>P{i+1}</SelectItem>)
                    }
                </Select>
                <Button
                    isDisabled={pid === -1}
                    onClick={() => {
                        resetModel();
                        resetStudyModel();
                        window.location.hash = '/study' + '?pid=' + pid;
                    }}
                >Начать</Button>
            </div>
        </CardBody>
    </Card>
    </div>
}