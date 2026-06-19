export class ListProSkillPublicDepartmentHelper {
  public static getDepartmentByCategory(category: string, dataSource: any[]) {
    const results: any[] = [];

    if (category === 'department') {
      dataSource
        .filter((el) => el.type === 0)
        .forEach((el) => {
          results.push(el);
        });
    } else {
      dataSource
        .filter((el) => el.type === 1)
        .forEach((el) => {
          results.push(el);
        });
    }

    return results;
  }

  public static processingDepartments(dataSource: any[]) {
    const results: any[] = [];

    results.push({ label: 'すべて', value: -1 });

    dataSource
      .map((el) => {
        const tmp = {
          label: `${el.code}: ${el.name}`,
          value: el.id,
        };

        return tmp;
      })
      .forEach((el) => {
        results.push(el);
      });

    return results;
  }

  public static processingSkill(dataSource: any[]) {
    const results: any[] = [];

    results.push({ label: 'すべて', value: -1 });

    dataSource
      .map((el) => {
        const tmp = {
          label: `${el.name}`,
          value: el.id,
        };

        return tmp;
      })
      .forEach((el) => {
        results.push(el);
      });

    return results;
  }
}
