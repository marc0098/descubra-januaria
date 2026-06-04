// src/lib/firestore-rest.ts
// Utilitário para buscar dados do Firestore usando a REST API.
// Isso evita problemas de timeout/falha do Firebase Client SDK rodando em Server Components no Vercel.

export function parseFirestoreDocument(doc: any) {
  const result: any = { id: doc.name.split('/').pop() };
  if (doc.fields) {
    for (const key in doc.fields) {
      const val = doc.fields[key];
      if (val.stringValue !== undefined) result[key] = val.stringValue;
      else if (val.integerValue !== undefined) result[key] = parseInt(val.integerValue, 10);
      else if (val.doubleValue !== undefined) result[key] = parseFloat(val.doubleValue);
      else if (val.booleanValue !== undefined) result[key] = val.booleanValue;
      else if (val.arrayValue !== undefined) {
         result[key] = (val.arrayValue.values || []).map((v: any) => v.stringValue || v.integerValue || v.booleanValue || v);
      } else if (val.timestampValue !== undefined) {
         result[key] = val.timestampValue;
      }
    }
  }
  return result;
}

export async function fetchDocumentById(collection: string, id: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return null;
  
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collection}/${id}`;
  
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      return parseFirestoreDocument(data);
    }
    return null;
  } catch (error) {
    console.error(`Erro na REST API ao buscar ${collection}/${id}:`, error);
    return null;
  }
}

export async function fetchDocumentBySlug(collection: string, slug: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return null;
  
  const queryUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;
  
  try {
    const res = await fetch(queryUrl, {
      method: 'POST',
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: collection }],
          where: {
            fieldFilter: {
              field: { fieldPath: 'slug' },
              op: 'EQUAL',
              value: { stringValue: slug }
            }
          },
          limit: 1
        }
      }),
      next: { revalidate: 60 }
    });
    
    if (res.ok) {
      const queryData = await res.json();
      if (queryData && queryData.length > 0 && queryData[0].document) {
        return parseFirestoreDocument(queryData[0].document);
      }
    }
    return null;
  } catch (error) {
    console.error(`Erro na REST API ao buscar ${collection} com slug ${slug}:`, error);
    return null;
  }
}
