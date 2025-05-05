# Intelligent Text Rewriting & Editing Platform
<img src="demo.gif">

## [Online Demo](https://damienmasson.com/Textoshop) / [How to build](#how-to-build-and-run) / [Publication (CHI'25)](#publication)

Textoshop (*"Intelligent Text Rewriting & Editing Platform"*) is a system that explores how interactions inspired by drawing software can help edit text. For instance:
- Text can be **lengthened** or **shortened** by dragging its edges. Similarly, text can be **moved** around and **rotated** to change the order of the words.
- Tools help edit the text. For instance, the **smudge tool** can paraphrase a passage, the **eraser tool** can remove words while keeping the text coherent, and the **tone brush** can change the tone.
- A **tone picker** allows exploring thousands of tone nuances by navigating a 2D space.
- **Boolean operations** can be used to compose sentences by combining, intersecting,
or subtracting ideas or phrases.
- **Text layers** allow structuring, displaying, and editing text in independent views.

Under the hood, our platform uses a large language model (LLM) to power many of these interactions. For more details, see the accompanying [research paper](#publication).


## How to build and run
The code is written in TypeScript and uses React and Vite. To build and run the code, you will need to have Node.js installed on your machine. You can download it [here](https://nodejs.org/en/download/).
First install the dependencies:
```bash
npm install
```
Then build the code:
```bash
npm run dev
```


## How to use?
After entering your OpenAI API key, you can test Textoshop using the shortcuts or you can run the study.
Note that the system was tested and developped for recent versions of **Google Chrome** or **Mozilla Firefox**.


## How to get an OpenAI API key?
Because Textoshop relies on the OpenAI API, you will need a key to make it work. You will need an account properly configured, see [here](https://platform.openai.com/account/api-keys) for more info.
Your key is never stored and the application runs locally and sends requests to the OpenAI API only.


## Can I try without an API key?
The systen depends on the OpenAI API to work. If you enter an incorrect key, you will still be able to go through the study but executing prompts will yield an error.


## Where are the video tutorials?
From the launcher, you can start the study to see the exact ordering and video tutorials participants went through.
Alternatively, you can go in the ``public/videos`` to review all the video tutorials.

## Publication
> Damien Masson, Young-Ho Kim, and Fanny Chevalier. 2025. Textoshop: Interactions Inspired by Drawing Software to Facilitate Text Editing. In Proceedings of the 2025 CHI Conference on Human Factors in Computing Systems (CHI '25) [10.1145/3706598.3713862](https://doi.org/10.1145/3706598.3713862)


You can also find the paper on [arXiv](https://arxiv.org/abs/2409.17088).