#include <iostream>
using namespace std;
int x[8] = {-1, -1, -1, 0, 1, 1, 1, 0};
int y[8] = {-1, 0, 1, 1, 1, 0, -1, -1};

int A[100][100];
int C[10000];
int visited[100][100];

void dfs(int m, int n, int i, int j, int counter) {
	A[i][j] = counter;
	C[counter]++;
	for(int k = 0; k < 8; k++) {
		int u = i +  x[k];
		int v = j + y[k];
		if(u >= 0 && u < m && v >= 0 && v < n) {
			if(A[u][v] == 1 && visited[u][v] == 0) {
				A[u][v] = counter;
				visited[u][v] = 1;
				dfs(m, n, u , v, counter);
			}
		}
	}
}
int getConnectedComponents(int m, int n) {
	int counter = 2;
	for( int l = 0; l < 10000; l++) {
		C[l] = 0;
	}
	
	for(int i = 0; i < m; i++) {
		for(int j = 0; j < n; j++) {
			visited[i][j] = 0;
		}
	}

	for(int i = 0; i < m; i++) {
		for(int j = 0; j < n; j++) {
			if(A[i][j] == 1 && visited[i][j] == 0) {
				dfs(m, n, i, j, counter);
				counter++;
			}
		}
	}
	
	int max = 0;
	for(int i = 2; i < m * n; i++) {
		if(max < C[i]) {
			max = C[i];
		}
	}
	return max;
}

int main() {
	while(1) {
		int m, n;
		cin >> m >> n;
		for(int i = 0; i < m; i++) {
			for(int j = 0; j < n; j++) {
				int u;
				cin >> u;
				A[i][j] = u;
			}
		}
		cout<<getConnectedComponents(m, n)<<endl;
	}
}
