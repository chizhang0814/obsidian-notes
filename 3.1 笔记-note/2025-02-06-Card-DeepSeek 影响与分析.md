# 1. 技术创新
## 1.1 时间回顾
2024年12月 DeepSeek-V3 发布：对标GPT-4o等大模型的基座模型
2025年01月 DeepSeek-R1 发布：对标OpenAI o1的思维链推理模型
## 1.2 DeepSeek-V3核心技术创新
### 技术继承
**依旧是transformer架构**，自2017年谷歌发布transformer架构之后，到目前为止所有的大语言模型都是基于此架构。
Transformer架构：在有限的GPU集群下对海量数据进行训练的一种架构，让大语言模型成为现实
### 技术架构创新
**MoE混合专家模型**
将大模型拆分为多个“专家”，训练时分工协作，推理时按需调用，效率提升（类似工厂流水线分工）
**什么是MoE：** 大模型参数非常多，假如一个大模型有8000亿个参数，实际上在每次处理一个数据token的时候不需要8000亿个参数都参与计算，可以把8000亿个参数拆分，比如说拆成40个200亿的小参数群，那么处理每一个token的时候只需要原来1/40的计算量就可以了。此外还有一个动态的**路由**分配每个token应该用哪个小参数群去计算，从而实现大模型可以降低成规模较小的中小型模型的计算量的需求。
MoE最早是OpenAI（GPT）和欧洲的MistralAI(Claude)，DeepSeek此次是在MoE的基础上，对**路由**进行了改进，让它更智能化一些，让计算量变小并且让路由带来的性能损失变得很低，准确度和精度得到提升。
**MLA多头潜在注意力机制**
Transformer架构中最重要的一个部分是**多头注意力MHA(Multi-Head Attention)** 机制，在使用GPU运行的时候涉及到两个尺寸很大的矩阵相乘，其计算量很大，尤其是当上下文信息非常长的时候，可以想象矩阵乘的计算量将是指数级增长。DeepSeek创新之处在于把MHA的两个大矩阵相乘改为线性代数中两个低秩（Low-Rank）近似矩阵的乘法，降低了整个计算量的要求。
**多token预测**
每次预测生成多个词，不像其他模型每次预测只预测一个词，提升预测效率。
大模型训练的时候，每预测一个token，都基于之前所有token形成的上下文去预测，比如已有10个字，在预测第11个字的时候要根据前10个字去计算第11个字，以此类推。**多token预测**则是在预测第11个字的时候，多预测几个，同时也预测第12，13个字，此时预测的第12，13个字并非最终结果，而是可以用于在真正预测第12个字或第13个字的时候减少一些计算量，更加丝滑加快速度。
### 工程优化创新
**FP8混合精度**
使用更精简的方式去记录浮点数并进行计算，省内存也省算力。做个比喻的话类似用速记符号去记录大段演讲。
FP8即为FloatPoint  8bits，也就是使用8位（一个字节）去记录一个浮点数。大模型中的参数和进行训练推理的数据都使用浮点数进行标识。早期大模型进行运算的时候使用的都是FP16（2个字节），FP32（4个字节）去记录一个浮点数，FP后的数字越高，代表用这种方式记录的浮点数精度越高，精度越高，单个浮点数所用的字节数越大，计算时带来的计算量越大，反之精度越低，计算量越小。但是精度不能无限低，精度降低会对准确度带来影响，这一点类似数字信号处理中的量化误差quantization error。DeepSeek此处的创新是使用了动态的FP8精度，训练时使用8位浮点数就可以减少很多计算量。

**GPU部署优化**
DeepSeek对GPU集群的部署也进行了优化，让GPU之间在通信的时候效率更高，节省训练时间，就好像原来GPU之间通信用的是“市内交通”，DeepSeek让GPU直接用“高速公路”进行通信。

## 1.3 DeepSeek-R1核心技术创新
DeepSeek-R1是对标O1的思维链推理模型，它不仅免费对公众开放，而且使用效果很好，更棒的是该模型还开源，整个行业和社会就一下兴奋起来，成为2025年开年的爆款热点。
### 纯粹的强化学习，不使用SFT监督微调
对整个社会而言DeepSeek-R1让大家耳目一新，第一次让公众可以免费地接触到一个好用的推理大模型。但真正对学术界带来震撼效果的则是在开发DeepSeek-R1过程中的前身DeepSeek-R1-Zero。
过去几年的科研和工程实践让人们普遍相信，要提升大型语言模型（LLM）的推理能力，必须先进行监督微调（SFT）。这就好比教导学生时，需要首先提供大量标记好的资料来训练模型，让它熟悉如何推理。不过，DeepSeek-R1-Zero却挑战了这一传统观念！该模型跳过了监督微调阶段，直接基于基础模型DeepSeek-V3-Base，采用了纯强化学习的方法进行训练。这就像是一个不需要通过具体例子指导，完全依靠自我探索和错误学习成长的模型，重新定义机器推理的可能性边界。
DeepSeek团队想探索是否可以只靠强化学习就能让大模型演化出强大的推理能力，就像让一个自己在实践中探索的学生，没做过任何模拟题，直接走进高考考场考出好成绩。
为了实现高效的强化学习训练，DeepSeek-R1-Zero推出了**GRPO（Group Relative Policy Optimization）** 算法，与传统强化学习使用的PPO（Proximal Policy Optimization）算法相比， GRPO不需要先训练价值模型（Value Model）而是通过**组得分**（Group Score）去估计baseline，从而降低了成本，让大规模的强化学习训练成为可能。
但是也正因为缺少了SFT这个步骤，导致DeepSeek-R1-Zero尽管推理能力更强大，但是输出的结果可读性较差，因此在开发DeepSeek-R1这个真正部署的版本的时候还是使用了SFT先对模型进行了训练然后才使用强化学习去训练。
### 直接展示推理过程
之前的推理模型并不会将大模型进行给推理的过程展现给使用者，这给使用者带了更好的用户体验，也给大模型输出的答案带来了一定的可解释性。用户再也不是只能看到答案，而是能看到答案生成的思考过程，对答案的正确性和合理性有了更多的信心，也更容易接受答案。

# $5M训练成本的审视
### 训练成本拆解和理解
DeepSeek声称的500万美金成本指的其实是训练DeepSeek-V3模型的成本，DeepSeek-V3的论文中描述训练DeepSeek-V3使用了2048个英伟达的H800型号GPU。H800是美国对中国禁运后的一个阉割型号，一共使用了280万个GPU小时，如果按照两美元每个GPU小时计算的话，训练成本一共是550万美金。但是在计算一个模型的成本的时候，需要考虑多方面因素，有早期的试错成本，微调的成本，测试验证的成本等等。550万美元的成本只是做DeepSeek-V3最终一次训练的成本。如果加上前前后后的微调等是肯定超过这个数字。并且在前期数据准备和蒸馏其他模型生成数据以及前期测试验证的成本是不包含在550万的成本中的。
### 如何看待5万张H100传言
DeepSeek V3发布以后有一个传言说DeepSeek有5万个H100GPU在新加披。这个传言主要来自于ScaleAI的一个创始人埃Alexander Wang。ScaleAI这个公司是做数据标注的，他不知道从哪儿来信源说DeepSeek有5万个H100GPU。这个传言既没有被证实也没有被证伪，但是我们知道真正训练一个大模型，需要很大量的前期训练，付出很多的试错成本，比如用于测试的多轮训练，数据的爬取，爬取互联网数据，对数据的蒸馏训练以及一步步的验证训练之类的前期准备工作。但是实际上这些工作都可以远程在线去做，并不需要在本地部署显卡。完全可以远程租一些GPU，无论这些GPU在社么地方，只要把数据上传训练，完成以后再下载模型参数，也就是上百G的大小，在本地做验证。所以不论自己有没有算力，只要能租到云端的GPU，就可以进行大模型的训练和开发。因此这个5万张H100的传言，具体真相如何并不重要，我们只需要知道，自己是否拥有算力并不制约对大模型的开发。
# GPU的需求
DeepSeek仅仅使用2048张卡就训练出V3的事实让大众再一次审视之前对大模型开发需要“万卡集群”的刻板印象，甚至英伟达的股票都应声下跌。那么GPU的需求是否真的会下降？目前人工智能技术对GPU的需求分为AI的发展对GPU的需求分成两部分：第一是训练部分，第二是推理部分。2019年-2023年，需求主要集中在训练部分，也就是“万卡集群”的印象形成的时期，当时大家都在拼底层基座模型的训练，但是发展至今，用于基座模型训练的互联网资料都已经相对固定，所以基座模型训练的算力需求趋缓，大致是一个对数级的增长。但是推理部分对于算力的需求是一个指数级的增长，因为有了模型训练完以后，对大模型的应用都是在使用模型进行推理，那么就如同ChatGPT出现以后业界所说的那样，互联网所有的应用都值得用大模型重做一遍，也就是说会有几乎无穷无尽的使用场景，伴随端侧运算能力的提升和更多尺寸小能力强特色明显的端侧大模型的出现，使用大模型的终端也会不断出现，导致对推理算力的需求呈指数级增长。尽管单个应用所需的算力会逐渐下降，更多的应用会不断出现。所以对于算力需求的增长，市场最终是看好的。
值得注意的是DeepSeek对国产算力的适配目前已经公开的信息显示华为昇腾910C和海光的DCU均已经能支持DeepSeek的高效推理。过去两年里，国内对大模型应用的一个主要担忧就是算力受制于人，甚至DeepSeek也只能使用阉割版的GPU进行训练，但是DeepSeek的实践显示，一方面训练时不需要那么多那么先进的国外显卡，对训练显卡的需求从之前的动辄万卡降到了2000多张卡即可，那么很有可能原来我们手头已有的算力也足够开发能力强大的基础模型，另一方面在部署的时候不再需要国外的算力芯片，目前国产的算力也足以支持先进大模型的部署。这样一来，国内企业对大模型的应用可以说是放开了手脚，之前的很多顾虑不再存在，这样一方面大量的采购可以支撑更多的大模型企业级应用出现，另一方面国产算力的发展也是未来可期，毕竟这类产品的迭代升级速度是相当快的。

# 对AI行业影响
# AI发展预估
