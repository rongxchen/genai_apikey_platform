from enum import Enum


class Provider(Enum):
    ChatGPT = "chatgpt"
    DeepSeek = "deepseek"
    SiliconFlow = "siliconflow"
    Poe = "poe"


class Model(Enum):
    # ChatGPT
    ChatGPT4oMini = "gpt-4o-mini"
    ChatGPT5 = "gpt-5"
    ChatGPT5p2 = "gpt-5.2"
    ChatGPT5Mini = "gpt-5-mini"
    # DeepSeek
    DeepSeekChat = "deepseek-chat"
    DeepSeekReasoner = "deepseek-reasoner"
    # SiliconFlow
    SiliconFlow_DeepSeek_v2p5 = "deepseek-ai/deepseek-chat-2.5"
    SiliconFlow_DeepSeek_v3 = "deepseek-ai/DeepSeek-V3"
    SiliconFlow_DeepSeek_Reasoner = "deepseek-ai/DeepSeek-R1"


MODEL_LABEL_MAP = {
    # ChatGPT
    Model.ChatGPT4oMini: "ChatGPT 4o mini",
    Model.ChatGPT5: "ChatGPT 5",
    Model.ChatGPT5p2: "ChatGPT 5.2",
    Model.ChatGPT5Mini: "ChatGPT 5 mini",
    # DeepSeek
    Model.DeepSeekChat: "DeepSeek-V3",
    Model.DeepSeekReasoner: "DeepSeek-R1",
    # SiliconFlow
    Model.SiliconFlow_DeepSeek_v2p5: "DeepSeek-V2.5",
    Model.SiliconFlow_DeepSeek_v3: "DeepSeek-V3",
    Model.SiliconFlow_DeepSeek_Reasoner: "DeepSeek-R1",
}


def construct_model_info(model: Model):
    return {
        "model": model.value,
        "label": MODEL_LABEL_MAP[model]
    }

MODEL_GROUPS = {
    Provider.ChatGPT.value: [construct_model_info(model) for model in [
        Model.ChatGPT4oMini,
        Model.ChatGPT5,
        Model.ChatGPT5p2,
        Model.ChatGPT5Mini,
    ]],
    Provider.DeepSeek.value: [construct_model_info(model) for model in [
        Model.DeepSeekChat, 
        Model.DeepSeekReasoner,
    ]],
    Provider.SiliconFlow.value: [construct_model_info(model) for model in [
        Model.SiliconFlow_DeepSeek_v2p5,
        Model.SiliconFlow_DeepSeek_v3,
        Model.SiliconFlow_DeepSeek_Reasoner,
    ]],
}
MODEL_GROUPS[Provider.Poe.value] = MODEL_GROUPS[Provider.ChatGPT.value]
