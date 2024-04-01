const tasks_config = {
  apiKey: process.env.TASKS_API_KEY,
  token: '',
  url: process.env.TASKS_URL
}

export const get_token_and_task_data = async (task_name: string) => {
  try {
    const response = await fetch(`${tasks_config.url}/token/${task_name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apikey: tasks_config.apiKey,
        taskName: task_name
      })
    })
    if (!response.ok) {
      throw new Error(`Failed to get token ${response.status}`)
    }
    const data = (await response.json()) as { token: string }
    console.log('Token: ', data.token)
    tasks_config.token = data.token

    const taskResponse = await fetch(`${tasks_config.url}task/${data.token}`)
    if (!taskResponse.ok) {
      throw new Error(`Failed to get task data ${taskResponse.status}`)
    }
    const taskData = await taskResponse.json()
    console.log('Task data: ', taskData)

    return taskData
  } catch (error) {
    console.error('Error fetching the token or task data:', error)
    return null
  }
}

export const send_answer = async (answer: any, token = tasks_config.token) => {
  try {
    const response = await fetch(`${tasks_config.url}answer/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        answer: answer
      })
    })
    const data = await response.json()
    console.log('Answer result: ', data)
    return data
  } catch (error) {
    console.error('Error sending the answer:', error)
    return null
  }
}
