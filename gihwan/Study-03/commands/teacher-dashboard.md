<!-- File timestamp: 2026-09-10 22:20:00 +09:00 -->
# 교사 성적 대시보드

학생 성적을 한눈에 비교하고 보고서 생성·내보내기까지 실행한다.

## 실행 순서

1. `teacher-roster`: 학생 성적과 손상 기록 조회
2. `teacher-compare`: 학생별 점수와 백분율 비교
3. `teacher-analysis`: 성취 구간과 학습 영역 분석
4. `create-report`: 상대평가 등급을 포함한 `Study-03/commands/teacher_report.html` 생성
5. `export-report`: 생성된 `Study-03/commands/teacher_report.html`을 CSV 또는 PDF로 내보내기

## 상대평가 등급

성적 백분율 내림차순 기준으로 다음 등급을 사용한다.

- 상위 20%: `A`
- 상위 40%: `B`
- 상위 70%: `C`
- 하위 30%: `D`

등급은 절대 점수가 아니라 같은 보고서에 포함된 유효 학생 집단 안에서의 상대 순위로 결정한다. 동점자가 등급 경계에 걸리면 동점 처리와 등급별 실제 인원을 함께 표시한다.

## `$ARGUMENTS` 처리

- 인자가 없으면 대시보드 요약과 `Study-03/commands/teacher_report.html`을 생성한다.
- `csv`이면 보고서 생성 후 CSV로 내보낸다.
- `pdf`이면 보고서 생성 후 PDF로 내보낸다.
- `csv,pdf`이면 두 형식 모두 내보낸다.
- 특정 닉네임이 주어지면 해당 학생을 포함한 전체 비교표에서 해당 학생을 강조한다.

## 최종 결과

- 학생별 순위, 점수, 백분율, A~D 상대평가 등급
- 평균, 중앙값, 최고점, 최저점
- 등급별 학생 수와 비율
- 카테고리별·문항별 통계의 수집 여부
- `Study-03/commands/teacher_report.html` 생성 결과
- 요청 형식의 CSV·PDF 내보내기 결과

원본 랭킹 데이터와 원본 HTML은 사용자 요청 없이 수정하거나 삭제하지 않는다.
