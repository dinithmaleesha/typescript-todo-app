export class DataResource<T> {
  constructor(private endpoint: string) {}

  async loadAll(): Promise<T[]> {
    const res = await fetch(this.endpoint)

    return res.json()
  }

  async save(data: T): Promise<Response> {
    const res = await fetch(this.endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type' : 'application/json' }
    })

    return res
  }

  async markDone(id: string, completed: boolean): Promise<Response> {
    const res = await fetch(`${this.endpoint}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed: completed }),
      headers: { 'Content-Type': 'application/json' },
    });
    return res;
  }

  async deleteTask(id: string): Promise<Response> {
    const res = await fetch(`${this.endpoint}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    return res
  }
}