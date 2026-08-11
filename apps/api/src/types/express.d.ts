declare global{
  namespace Express{
    interface Request{
      projectId: string;
    }
  }
}

export {};
