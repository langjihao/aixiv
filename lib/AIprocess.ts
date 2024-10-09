import axios from 'axios';
import dotenv from 'dotenv';


dotenv.config();

const chatUrl = process.env.NEXT_PUBLIC_AI_BASE_URL || 'https://api.siliconflow.cn/v1/chat/completions';
const apiKey = process.env.NEXT_PUBLIC_AI_API_KEY || 'your-api-key-here';
function parseStringToArray(input: string): string[] {
  try {
    // 将单引号替换为双引号，以符合 JSON 格式
    console.log(input);
    const jsonString = input.replace(/'/g, '"');
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('解析字符串时出错:', error);
    return [];
  }
}
interface Message {
  role: string;
  content: string;
}

interface Payload {
  model: string;
  messages: Message[];
  stream: boolean;
  max_tokens: number;
  temperature: number;
  top_p: number;
  top_k: number;
  frequency_penalty: number;
  n: number;
}

interface ResponseChoice {
  message: {
    content: string;
  };
}

interface ApiResponse {
  choices: ResponseChoice[];
}

const getAiSummary = async (abstract: string, model = 'meta-llama/Meta-Llama-3.1-8B-Instruct'): Promise<string> => {
  const payload: Payload = {
    model,
    messages: [
      {
        role: 'system',
        content: `你需要从人工智能论文摘要中提取出关键信息，用不多于300字的汉语进行概述，其中任务背景不需要提取，重点说明方法和结果。
                  例如收到摘要：'Automatic medical report generation (MRG) is of great research value as it has the potential to relieve
                    radiologists from the heavy burden of report writing. Despite recent advancements, accurate MRG remains challenging 
                    due to the need for precise clinical understanding and disease identification. Moreover, the imbalanced distribution of 
                    diseases makes the challenge even more pronounced, as rare diseases are underrepresented in training data, making their 
                    diagnostic performance unreliable. To address these challenges, we propose diagnosis-driven prompts for medical report 
                    generation (PromptMRG), a novel framework that aims to improve the diagnostic accuracy of MRG with the guidance of diagnosis-aware
                      prompts. Specifically, PromptMRG is based on encoder-decoder architecture with an extra disease classification branch. When generating reports, 
                      the diagnostic results from the classification branch are converted into token prompts to explicitly guide the generation process.
                        To further improve the diagnostic accuracy, we design cross-modal feature enhancement, which retrieves similar reports from the database 
                        to assist the diagnosis of a query image by leveraging the knowledge from a pre-trained CLIP. Moreover, the disease imbalanced issue 
                        is addressed by applying an adaptive logit-adjusted loss to the classification branch based on the individual learning status of each disease,
                          which overcomes the barrier of text decoder's inability to manipulate disease distributions. Experiments on two MRG benchmarks show the 
                          effectiveness of the proposed method, where it obtains state-of-the-art clinical efficacy performance on both datasets.'
                  你需要返回：'一种新的框架PromptMRG，它基于编码器-解码器架构，具有额外的疾病分类分支。在生成报告时，从分类分支的诊断结果转换为令牌提示，以明确指导生成过程。
                  为了进一步提高诊断准确性，我们设计了跨模态特征增强，通过从数据库中检索相似报告来辅助查询图像的诊断，利用预训练的CLIP的知识。
                  此外，通过根据每种疾病的个体学习状态应用自适应的对数调整损失到分类分支，解决了文本解码器无法操作疾病分布的障碍。'`
      },
      {
        role: 'user',
        content: abstract
      }
    ],
    stream: false,
    max_tokens: 512,
    temperature: 0.7,
    top_p: 0.7,
    top_k: 50,
    frequency_penalty: 0.5,
    n: 1
  };

  const headers = {
    'accept': 'application/json',
    'content-type': 'application/json',
    'authorization': `Bearer ${apiKey}`
  };

  try {
    const response = await axios.post<ApiResponse>(chatUrl, payload, { headers });
    const content = response.data.choices[0].message.content;
    return content;
  } catch (error) {
    console.error('Error fetching AI summary:', error);
    throw error;
  }
};
// 根据摘要和已有关键词，生成新的关键词
//TODO：后续改为自训练的Tag模型
const getAiTags = async (abstract: string, tags: string[] = ['检索', '辅助分支', '损失函数', '数据不平衡', '速度快', '轻量化', 'Resnet', 'VIT', 'CLIP'], model = 'meta-llama/Meta-Llama-3.1-8B-Instruct') => {
  const content = `摘要:${abstract}关键词:${JSON.stringify(tags)}`;
  const payload: Payload = {
    model,
    messages: [
      {
        role: 'system',
        content: `你需要从人工智能论文摘要中提取出一些0-5个关键词,重点体现:论文解决的难点如【数据不平衡】、【模型幻觉】等，使用的方法或基础网络如【Resnet】、【多分支网络】、【辅助模型】等，
                  主要优点如:【速度快】、【轻量化】等，你会同时收到一组参考标签，你可以从中进行选择，也可以创建新的关键词。
                  返回值要使用英文标点符号分隔。
                  例如收到信息：'摘要: Automatic medical report generation (MRG) is of great research value as it has the potential to relieve
                    radiologists from the heavy burden of report writing. Despite recent advancements, accurate MRG remains challenging 
                    due to the need for precise clinical understanding and disease identification. Moreover, the imbalanced distribution of 
                    diseases makes the challenge even more pronounced, as rare diseases are underrepresented in training data, making their 
                    diagnostic performance unreliable. To address these challenges, we propose diagnosis-driven prompts for medical report 
                    generation (PromptMRG), a novel framework that aims to improve the diagnostic accuracy of MRG with the guidance of diagnosis-aware
                      prompts. Specifically, PromptMRG is based on encoder-decoder architecture with an extra disease classification branch. When generating reports, 
                      the diagnostic results from the classification branch are converted into token prompts to explicitly guide the generation process.
                        To further improve the diagnostic accuracy, we design cross-modal feature enhancement, which retrieves similar reports from the database 
                        to assist the diagnosis of a query image by leveraging the knowledge from a pre-trained CLIP. Moreover, the disease imbalanced issue 
                        is addressed by applying an adaptive logit-adjusted loss to the classification branch based on the individual learning status of each disease,
                          which overcomes the barrier of text decoder's inability to manipulate disease distributions. Experiments on two MRG benchmarks show the 
                          effectiveness of the proposed method, where it obtains state-of-the-art clinical efficacy performance on both datasets.
                          关键词:[检索, 辅助分支，损失函数，数据不平衡，速度快，轻量化,Resnet,VIT,CLIP]。'
                  你需要返回:['检索', '辅助分支', '数据不平衡', 'CLIP', '损失函数']`
      },
      {
        role: 'user',
        content
      }
    ],
    stream: false,
    max_tokens: 512,
    temperature: 0.7,
    top_p: 0.7,
    top_k: 50,
    frequency_penalty: 0.5,
    n: 1
  };

  const headers = {
    'accept': 'application/json',
    'content-type': 'application/json',
    'authorization': `Bearer ${apiKey}`
  };

  try {
    const response = await axios.post<ApiResponse>(chatUrl, payload, { headers });
    const content = response.data.choices[0].message.content;
    return parseStringToArray(content);
  } catch (error) {
    console.error('Error fetching AI tags:', error);
    throw error;
  }
};

const getAiTranslation = async (abstract: string, model = 'meta-llama/Meta-Llama-3.1-8B-Instruct') => {
  const payload: Payload = {
    model,
    messages: [
      {
        role: 'system',
        content: `你是一位精通简体中文的专业翻译，尤其擅长将专业学术论文翻译成浅显易懂的科普文章。我希望你能帮我将以下英文论文段落翻译成中文，风格与科普杂志的中文版相似。
                  规则：
                  - 翻译时要准确传达原文的事实和背景。
                  - 即使上意译也要保留原始段落格式，以及保留术语，例如 FLAC，JPEG 等。保留公司缩写，例如 Microsoft, Amazon 等。
                  - 以下是常见的 AI 相关术语词汇对应表：
                  * Transformer -> Transformer
                  * LLM/Large Language Model -> 大语言模型
                  * Generative AI -> 生成式 AI`
      },
      {
        role: 'user',
        content: abstract
      }
    ],
    stream: false,
    max_tokens: 512,
    temperature: 0.7,
    top_p: 0.7,
    top_k: 50,
    frequency_penalty: 0.5,
    n: 1
  };

  const headers = {
    'accept': 'application/json',
    'content-type': 'application/json',
    'authorization': `Bearer ${apiKey}`
  };

  try {
    const response = await axios.post<ApiResponse>(chatUrl, payload, { headers });
    const content = response.data.choices[0].message.content;
    return content;
  } catch (error) {
    console.error('Error fetching AI translation:', error);
    throw error;
  }
};

export { getAiSummary, getAiTags, getAiTranslation };